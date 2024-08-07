<script setup>
    import { z } from 'zod'
    import { categories, type } from "~/constants";
    import {fa} from "@faker-js/faker";

    const props = defineProps({
        modelValue: Boolean,
        transaction: {
            type: Object,
            required: false
        }
    });
    const supabase = useSupabaseClient();
    const {toastSuccess, toastError} = useAppToast();
    const form = ref();
    const isLoading = ref(false)
    const emit = defineEmits(['update:modelValue', 'saved']);
    const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => {
            if (!value) resetForm();
            emit('update:modelValue', value)
        }
    });
    const isEditing = computed(() => !!props.transaction)
    const initialState = isEditing.value ? {
            type: props.transaction.type,
            amount: props.transaction.amount,
            created_at: props.transaction.created_at.split('T')[0],
            description: props.transaction.description,
            category: props.transaction.category  }
        : {
        type: undefined,
        amount: 0,
        created_at: undefined,
        description: undefined,
        category: undefined
    };

    const state = ref({...initialState});
    const defaultSchema = z.object({
        created_at: z.string(),
        description: z.string().optional(),
        amount: z.number().positive('Amount must be greater than 0'),
    });

    const incomeSchema = z.object({
        type: z.literal('Income')
    })

    const investmentSchema = z.object({
        type: z.literal('Investment')
    })

    const savingSchema = z.object({
        type: z.literal('Saving')
    })

    const expenseSchema = z.object({
        type: z.literal('Expense'),
        category: z.enum(categories)
    })

    const schema = z.intersection(
        z.discriminatedUnion('type', [
            incomeSchema,
            expenseSchema,
            investmentSchema,
            savingSchema
        ]),
        defaultSchema
    );

    const save = async () => {
        if (form.value.errors.length) return

        isLoading.value = true;
        try {
            const { error } = await supabase
                .from('transactions')
                .upsert({
                    ...state.value,
                    id: props.transaction?.id
                })
                if (!error) {
                    toastSuccess({title: "Transaction saved"});
                    isOpen.value = false;
                    emit('saved')
                    return
                }
                throw error
        } catch (e) {
            toastError({title: "Transaction not saved", description: e.message});
        } finally {
            isLoading.value = false;
        }
    }

    const resetForm = () => {
        Object.assign(state.value, initialState)
        form.value.clear()
    }
</script>

<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header>
                {{ isEditing ? 'Edit' : 'Add'}} Transaction
            </template>

            <UForm :state="state" :schema="schema" :validate-on="['submit']" ref="form" @submit="save">
                <UFormGroup :required="true" label="Transaction Type"  name="type" class="mb-4">
                    <USelect :disabled="isEditing" v-model="state.type" placeholder="Select Transaction Type" :options="type" />
                </UFormGroup>
                <UFormGroup label="amount" :required="true" name="amount" class="mb-4">
                    <UInput v-model.number="state.amount" type="number" placeholder="amount"/>
                </UFormGroup>
                <UFormGroup label="Transaction date" :required="true" name="created_at" class="mb-4">
                    <UInput v-model="state.created_at" type="date"  icon="i-heroicons-calendar"/>
                </UFormGroup>
                <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
                    <UInput v-model="state.description" placeholder="Description"/>
                </UFormGroup>
                <UFormGroup :required="true" label="Category" name="category" class="mb-4" v-if="state.type === 'Expense'">
                    <USelect v-model="state.category" placeholder="Select Category" :options="categories" />
                </UFormGroup>

                <UButton :loading="isLoading" type="submit" color="black" variant="solid" label="Save"/>
            </UForm>
        </UCard>
    </UModal>
</template>

<style scoped>

</style>
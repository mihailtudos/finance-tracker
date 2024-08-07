<script setup>
    const isLoading = ref(false);
    const { toastError, toastSuccess } = useAppToast();
    const emit = defineEmits(['deleted', 'edited']);
    const props = defineProps({
        transaction: Object,
    });
    const { currency } = useCurrency(props.transaction.amount);
    const isIncome = computed(() => props.transaction.type.toLowerCase() === 'income');
    const icon = computed(() => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left');
    const iconColor = computed(() => isIncome.value ? 'text-green-600' : 'text-red-600');
    const supabase = useSupabaseClient();
    const isOpen = ref(false)

    const deleteTransaction = async () => {
        isLoading.value = true;
        try {
            const {error} = await supabase
                .from('transactions')
                .delete()
                .eq('id', props.transaction.id)
            toastSuccess({ title: 'Transaction deleted'});
            emit('deleted', props.transaction.id)
        } catch (e) {
            toastError({ title: 'Transaction deleted', description: e.message });
        } finally {
            isLoading.value = false;
        }
    }

    const items = [
        [
            {
                label: 'Edit',
                icon: 'i-heroicons-pencil-square-20-solid',
                click: () => isOpen.value = true
            },
            {
                label: 'Delete',
                icon: 'i-heroicons-trash-20-solid',
                click: deleteTransaction
            },
        ]
    ];
</script>

<template>
    <div class="grid grid-cols-3 p-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
        <div class="flex items-center justify-between space-x-4 col-span-2">
            <div class="flex items-center space-x-1">
                <UIcon :name="icon" :class="[iconColor]" dynamic/>
                <div>{{ transaction.description }}</div>
            </div>
            <UBadge v-if="transaction.category" color="white">{{ transaction.category }}</UBadge>
        </div>
        <div class="flex items-center justify-end space-x-2">
            <div>{{ currency }}</div>
            <div>
                <UDropdown :items="items" :popper="{placement: 'bottom-start'}" >
                    <UButton :loading="isLoading" color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" />
                    <TransactionModal v-model="isOpen" :transaction="transaction" @save="emit('edited')"/>
                </UDropdown>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
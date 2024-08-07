<script setup>
    import {z} from 'zod'
    import {useAppToast} from "~/composables/useAppToast.js";
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { toastSuccess, toastError } = useAppToast()
    const pending = ref(false)
    const initialState = {
        name: user.value.user_metadata?.full_name,
        email: user.value.email,
    }

    const state = ref({...initialState})
    const schema = z.object({
        name: z.string().min(2).optional(),
        email: z.string().email()
    })

    const saveProfile = async () => {
        pending.value = true
        try {
            const formData = {
                data: {
                    full_name: state.value.name
                }
            }

            if (user.value.email !== state.value.email) {
                formData['email'] = state.value.email
            }

            const { data, error } = await supabase.auth.updateUser(formData)
            if (error) throw error

            toastSuccess({
                title: 'User updated successfully',
                description: 'Profile has been updated'
            })
        } catch (e) {
            toastError({title: 'Failed user update', description: e.message})
        } finally {
            pending.value = false
        }
    }
</script>

<template>
    <UForm @submit="saveProfile" validate-on="submit" :schema="schema" :state="state">
        <UFormGroup class="mb-4" label="Full name" name="name">
            <UInput v-model="state.name" name="name" />
        </UFormGroup>

        <UFormGroup class="mb-4" label="Email" name="email" help="You will need access to both the old and new email for email confirmation.">
            <UInput v-model="state.email" name="email" :required="true" />
        </UFormGroup>

        <UButton type="submit" color="black" variant="solid" label="Save" :loading="pending" :disabled="pending"/>
    </UForm>
</template>

<style scoped>

</style>
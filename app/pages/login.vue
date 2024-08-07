<script setup>
    import {useRedirectIfAuthenticated} from "~/composables/useRedirectIfAuthenticated.js";

    const success = ref(false)
    const email = ref(undefined)
    const pending = ref(false)
    const { toastError, toastSuccess } = useAppToast()
    const supabase = useSupabaseClient()
    const baseUrl = useRuntimeConfig().public.baseUrl;

    useRedirectIfAuthenticated('/')
    const handleLogin = async () => {
        pending.value = true
        try {
            const {error} = await supabase.auth.signInWithOtp({
                email: email.value,
                options: {
                    emailRedirectTo: `${baseUrl}/confirm`
                }
            })

            if (error) {
                toastError({title: "Error authenticating", description: error.message });
            } else {
                success.value = true
            }
        } catch (e) {
            toastError({title: "Error authenticating", description: error.message });
        } finally {
            pending.value = false
        }
    }
</script>

<template>
    <UCard v-if="!success">
        <template #header>
            Sign in to finance tracker
        </template>

        <form @submit.prevent="handleLogin">
            <UFormGroup label="Email" class="mb-4" name="email" :required="true" help="You will receive an email with the confirmation link">
                <UInput v-model="email" type="email" placeholder="Email" :required="true"/>
            </UFormGroup>
            <UButton :loading="pending" :disabled="pending" type="submit" variant="solid" color="black" label="Sign in"/>
        </form>
    </UCard>

    <UCard v-else>
        <template #header>
            Magic email has been sent
        </template>
        <div class="text-center">
            <p>We have sent an email to <strong>{{ email }}</strong> with a link to sign in.</p>
            <p>
                <strong>Important: </strong> The link will expire in 5 minutes.
            </p>
        </div>
    </UCard>
</template>

<style scoped>

</style>
<script setup>

    import {useRedirectIfAuthenticated} from "~/composables/useRedirectIfAuthenticated.js";

    useRedirectIfAuthenticated('/')
</script>

<template>
    <UCard>
        <template #header>
            Signing in...
        </template>
        Wait a moment while we sign you in
    </UCard>
</template>

<style scoped>

</style>
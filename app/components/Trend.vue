<script setup>
    import {useCurrency} from "../composables/useCurrency.js";

    const props = defineProps({
        title: String,
        amount: Number,
        lastAmount: Number,
        color: String,
        loading: Boolean,
    });
    const { amount } = toRefs(props)
    const trendingUp = computed(() => () => props.amount >= props.lastAmount);
    const icon = computed(() =>
         trendingUp ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down');
    const percentageTrend = computed(() => {
        if (props.amount === 0 || props.lastAmount === 0) return '~%'
        const bigger = Math.max(props.lastAmount, props.amount);
        const lower = Math.min(props.lastAmount, props.amount);
        const ratio = ((bigger - lower) / lower) * 100;

        return `${Math.ceil(ratio)}%`
    });

    const { currency } = useCurrency(amount);
</script>

<template>
    <div>
        <div class="font-bold" :class="[props.color]">{{ props.title }}</div>
        <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
            <USkeleton class="h-8 w-full" v-if="props.loading" />
            <div v-else>{{ currency }}</div>
        </div>
        <div>
            <USkeleton class="h-6 w-full" v-if="props.loading"/>
            <div v-else class="flex space-x-1 items-center text-sm">
                <UIcon :name="icon" class="h-6 w-6" :class="{'green' : trendingUp, 'red': !trendingUp}" dynamic/>
                <div class="text-gray-500 dark:text-gray-400">
                    {{ percentageTrend }} vs last period
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.green {
    @apply text-green-600 dark:text-green-400
}
.red {
    @apply text-red-600 dark:text-red-400
}
</style>
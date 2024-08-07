<script setup>
    import {transactionViewOptions} from "~/constants.js";
    import {useSelectedTimePeriod} from "~/composables/useSelectedTimePeriod.js";
    const user = useSupabaseUser()

    const selectedView = ref(user.value.user_metadata?.transaction_view ?? transactionViewOptions[1]);
    const {current, previous} = useSelectedTimePeriod(selectedView);

    const isOpen = ref(false)
    const {pending, refresh, transactions: {
        income,
        incomeCount,
        incomeTotal,
        expense,
        expenseCount,
        expenseTotal,
        grouped: {
            byDate
        }
    }} = useFetchTransactions(current)
    const {refresh: refreshPrevious, transactions: {
        incomeTotal: prevIncomeTotal,
        expenseTotal: prevExpenseTotal,
    }} = useFetchTransactions(previous)

    await Promise.all([refresh(), refreshPrevious()])
</script>

<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>
        <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="prevIncomeTotal" :loading="pending"/>
        <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="prevExpenseTotal" :loading="pending"/>
        <Trend color="green" title="Investments" :amount="4000" :last-amount="2000" :loading="pending"/>
        <Trend color="red" title="Saving" :amount="4000" :last-amount="4000" :loading="pending"/>
    </section>
    <section class="flex items-center justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold"></h2>
            <div class="text-gray-500 dark:text-gray-400">
                You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
            </div>
        </div>
        <div>
            <TransactionModal v-model="isOpen" @saved="refresh()"/>
            <UButton @click="isOpen = true"
                     icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" />
        </div>
    </section>
    <section v-if="!pending">
        <div v-for="(transactionOnDay, date) in byDate" :key="date" class="mb-10">
            <DailyTransactionSummary :date="date" :transactions="transactionOnDay"/>
            <Transaction v-for="transaction in transactionOnDay" :key="transaction.id" :transaction="transaction"
                         @deleted="refresh()" @edited="refresh()"/>
        </div>
    </section>
    <section v-else class="h-8 w-full mb-2" v-for="i in 4" :key="i"></section>
</template>

<style scoped>

</style>
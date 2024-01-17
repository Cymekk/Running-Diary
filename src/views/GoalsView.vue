<template>
	<NavbarComponent title="Goals" />
	<div class="container max-w-[600px] p-[16px] pt-0">
		<button class="button" @click="router.push('/addgoal')">Add goal</button>
		<div class="header flex justify-center items-center my-[16px] space-x-[8px] text-[#8F9DBF]">
			<span class="cursor-pointer" :class="{ 'border-b-[1px] border-[#8F9DBF]': inProgess }" @click="inProgess = true"
				>In Progress</span
			>

			<span class="cursor-pointer" :class="{ 'border-b-[1px] border-[#8F9DBF]': !inProgess }" @click="inProgess = false"
				>Ended</span
			>
		</div>

		<div class="in-progress-box text-[#8f9dbf]" v-if="inProgess">
			<span class="block text-center text-[24px]" v-if="inProgressGoals.length === 0">No active goals</span>
			<GoalComponent v-for="(item, index) in inProgressGoals" :key="index" :goal="item" />
		</div>

		<div class="completed-box text-[#8f9dbf]" v-else>
			<span class="block text-center text-[24px]" v-if="completedGoal.length === 0">No completed goals</span>
			<GoalComponent v-for="(item, index) in completedGoal" :key="index" :goal="item" />
		</div>
	</div>
</template>

<script setup>
//imports
import GoalComponent from '../components/GoalComponent.vue'
import NavbarComponent from '../components/NavbarComponent.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStoreGoals } from '../stores/storeGoals'

//store
const storeGoals = useStoreGoals()

//router
const router = useRouter()

//variable for handling in progress/finished goals
const inProgess = ref(true)

onMounted(() => {
	storeGoals.init()
})

const inProgressGoals = computed(() => {
	return storeGoals.goals.filter(el => {
		return el.completed === false
	})
})

const completedGoal = computed(() => {
	return storeGoals.goals.filter(el => {
		return el.completed === true
	})
})
</script>

<style lang="scss" scoped></style>

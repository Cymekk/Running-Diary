<template>
	<NavbarComponent title="Add Goal" />
	<div class="container max-w-[600px] text-[#8F9DBF] p-[16px] pt-0">
		<button class="button" @click="router.back">Back</button>
		<p class="text-center mt-[16px] text-[20px] font-semibold">Select Goal Type</p>

		<!-- Goal Type -->
		<div class="goal-type pt-0 flex flex-col justify-center items-center">
			<div class="type-box mt-[8px] px-[16px] py-[8px] flex items-center border-[1px] border-[#8F9DBF] rounded-md">
				<input type="radio" name="goalType" id="progress" class="mr-[8px]" value="progress" v-model="typeInput" />
				<label for="progress">Progress (e.g. travel 100km)</label>
			</div>
			<div class="type-box mt-[8px] px-[16px] py-[8px] flex items-center border-[1px] border-[#8F9DBF] rounded-md">
				<input type="radio" name="goalType" id="target" class="mr-[8px]" value="target" v-model="typeInput" />
				<label for="target">Target (e.g. lose weight, training goal)</label>
			</div>
		</div>

		<AddProgressGoalComponent v-if="typeInput === 'progress'" />
		<AddTargetGoalComponent v-if="typeInput === 'target'" />
	</div>
</template>

<script setup>
//imports
import AddTargetGoalComponent from '../components/AddTargetGoalComponent.vue'
import NavbarComponent from '../components/NavbarComponent.vue'
import AddProgressGoalComponent from '../components/AddProgressGoalComponent.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

//router
const router = useRouter()

const typeInput = ref('')
</script>

<style lang="scss" scoped></style>

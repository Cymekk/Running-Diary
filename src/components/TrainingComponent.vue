<template>
	<div
		class="body p-[16px] bg-[#344573] text-[#B8C1D9] mt-[16px] rounded-md w-full">
		<div class="header flex justify-between">
			<div class="date flex items-center">
				<img
					src="../assets/icons/calendar.svg"
					alt="calendar icon"
					class="w-[30px] mr-[8px]" />
				<p>{{ note.date }}</p>
			</div>

			<div class="time flex items-center">
				<img
					src="../assets/icons/time.svg"
					alt="time icon"
					class="w-[30px] mr-[8px]" />
				<p>{{ note.time }}</p>
			</div>

			<div class="buttons">
				<button
					class="w-[20px] h-[20px] bg-[url('../assets/icons/edit.svg')] bg-center bg-cover mr-[8px]"></button>
				<button
					@click="deletePopup = true"
					class="w-[20px] h-[20px] bg-[url('../assets/icons/delete.svg')] bg-center bg-cover"></button>
			</div>
		</div>
		<div class="main-content mt-[16px] flex items-center">
			<div
				class="image relative w-1/5 h-[60px] rounded-full bg-[#101D40] mr-[6px]">
				<img
					src="../assets/icons/human.svg"
					alt=""
					class="absolute -bottom-[5px]" />
			</div>

			<div class="details flex flex-wrap w-4/5">
				<div class="box flex w-1/2">
					<img
						src="../assets/icons/distance.svg"
						alt="distance icon"
						class="w-[30px] mr-[4px]" />
					<p>{{ note.distance }} km</p>
				</div>
				<div class="box flex w-1/2">
					<img
						src="../assets/icons/speed.svg"
						alt="distance icon"
						class="w-[30px] mr-[4px]" />
					<p>{{ note.avgPace }} min/km</p>
				</div>
				<div class="box flex w-1/2 mt-[12px]">
					<img
						src="../assets/icons/speed.svg"
						alt="distance icon"
						class="w-[30px] mr-[4px]" />
					<p>{{ note.avgSpeed }} km/h</p>
				</div>
				<div class="box flex w-1/2 mt-[12px]">
					<img
						src="../assets/icons/speed.svg"
						alt="distance icon"
						class="w-[30px] mr-[4px]" />
					<p>{{ note.burnedCalories }} kcal</p>
				</div>
			</div>
		</div>
	</div>
	<RemoveTrainigPopupComponent v-model="deletePopup" :id="note.id" />
</template>

<script setup>
//imports
import { ref } from "vue"
import RemoveTrainigPopupComponent from "./RemoveTrainigPopupComponent.vue"

//props
const props = defineProps({
	note: {
		type: Object,
	},
})

//variable handling delete popup is visible or not
const deletePopup = ref(false)
</script>

<style lang="scss" scoped></style>

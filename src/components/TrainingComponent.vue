<template>
	<div class="body p-[16px] bg-[#344573] text-[#B8C1D9] mt-[16px] rounded-md w-full">
		<div class="header flex justify-between items-center">
			<div class="date flex items-center">
				<img src="../assets/icons/calendar.svg" alt="calendar icon" class="w-[30px] mr-[8px]" />
				<p>{{ note.date }}</p>
			</div>

			<div class="time flex items-center">
				<img src="../assets/icons/time.svg" alt="time icon" class="w-[30px] mr-[8px]" />
				<p>
					<span v-if="hoursLength !== 0 && hoursLength !== ''">{{ note.hours }}h:</span>{{ note.minutes }}m:{{
						note.seconds
					}}s
				</p>
			</div>

			<div class="buttons flex items-center">
				<button
					@click="openEditPopup()"
					class="w-[20px] h-[20px] bg-[url('../assets/icons/edit.svg')] bg-center bg-cover mr-[8px]"
				></button>
				<button
					@click="deletePopup = true"
					class="w-[20px] h-[20px] bg-[url('../assets/icons/delete.svg')] bg-center bg-cover"
				></button>
			</div>
		</div>
		<div class="main-content mt-[16px] flex items-center sm:justify-between">
			<div class="image relative w-[60px] sm:w-[80px] md:w-[120px] rounded-full bg-[#101D40] mr-[6px] p-[8px]">
				<img src="../assets/icons/human.svg" alt="running human icon" class="w-full h-full object-fill" />
			</div>

			<div class="details flex flex-wrap w-4/5 sm:w-3/5">
				<div class="box flex items-center w-1/2 sm:justify-start">
					<img src="../assets/icons/distance.svg" alt="distance icon" class="w-[30px] mr-[4px] md:mr-[12px]" />
					<p>{{ note.distance }} km</p>
				</div>
				<div class="box flex items-center w-1/2 sm:justify-start">
					<img src="../assets/icons/speed.svg" alt="distance icon" class="w-[30px] mr-[4px] md:mr-[12px]" />
					<p>{{ note.avgPace }} min/km</p>
				</div>
				<div class="box flex items-center w-1/2 mt-[16px] sm:justify-start">
					<img src="../assets/icons/speed.svg" alt="distance icon" class="w-[30px] mr-[4px] md:mr-[12px]" />
					<p>{{ note.avgSpeed }} km/h</p>
				</div>
				<div class="box flex items-center w-1/2 mt-[16px] sm:justify-start">
					<img src="../assets/icons/speed.svg" alt="distance icon" class="w-[30px] mr-[4px] md:mr-[12px]" />
					<p>{{ note.burnedCalories }} kcal</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Remove Popup -->
	<PopupsComponent v-model="deletePopup">
		<template #remove-training>
			<h2 class="title">Remove Training</h2>
			<div class="training-details flex flex-col">
				<p class="text-center">Are you sure that you want to remove below training?</p>
				<div class="flex justify-center space-x-[16px]">
					<span class="font-bold">Date: </span> <span>{{ note.date }}</span>
				</div>
				<div class="flex justify-center space-x-[16px]">
					<span class="font-bold">Distance: </span> <span>{{ note.distance }}km</span>
				</div>
			</div>

			<div class="buttons flex justify-center space-x-[16px] mt-[16px]">
				<button
					class="button mx-0 bg-[#4D5F8C] text-[#B8C1D9] hover:text-[#4D5F8C] hover:bg-[#B8C1D9]"
					@click="deletePopup = false"
				>
					Cancel
				</button>
				<button class="button mx-0" @click="removeGoal()">Remove</button>
			</div>
		</template>
	</PopupsComponent>

	<PopupsComponent v-model="editPopup">
		<template #edit-training>
			<h2 class="title">Edit Training</h2>

			<div class="inputs flex flex-col space-y-[16px]">
				<div :class="{ 'text-red-500': editV$.date.$error }">
					<label for="date" class="block text-center">Date</label>
					<input
						type="date"
						id="date"
						v-model="noteDetails.date"
						class="input border-[1px] border-[#6C7CA6]"
						:class="{ 'border-red-500': editV$.date.$error }"
					/>
					<span class="input-error mb-0" v-if="editV$.date.$error"
						>Date need to be provided also you cannot add training in future</span
					>
				</div>

				<div :class="{ 'text-red-500': editV$.distance.$error }">
					<label for="distance" class="block text-center">Distance</label>
					<input
						type="number"
						id="distance"
						class="input border-[1px] border-[#6C7CA6]"
						:class="{ 'border-red-500': editV$.distance.$error }"
						v-model="noteDetails.distance"
						@focusout="formatDistance()"
					/>
					<span class="input-error mb-0" v-if="editV$.distance.$error"
						>Distance input cannot be blank, also distance value should be greater than 0.</span
					>
				</div>

				<div>
					<label
						class="block text-center"
						:class="{ 'text-red-500': editV$.hours.$error || editV$.minutes.$error || editV$.seconds.$error }"
						>Time</label
					>
					<div class="time-details flex">
						<input
							type="number"
							class="input border-[1px] text-center"
							:class="{ 'border-red-500 text-red-500': editV$.hours.$error, 'border-[#6c7ca6]': !editV$.hours.$error }"
							v-model="noteDetails.hours"
						/>
						<input
							type="number"
							class="input mx-[12px] border-[1px] text-center"
							:class="{
								'border-red-500 text-red-500': editV$.minutes.$error,
								'border-[#6c7ca6]': !editV$.minutes.$error,
							}"
							v-model="noteDetails.minutes"
						/>
						<input
							type="number"
							class="input border-[1px] text-center"
							:class="{
								'border-red-500 text-red-500': editV$.seconds.$error,
								'border-[#6c7ca6]': !editV$.seconds.$error,
							}"
							v-model="noteDetails.seconds"
						/>
					</div>
					<span class="input-error mb-0" v-if="editV$.hours.$error">Hours input should be greater than 0</span>
					<span class="input-error mb-0" v-if="editV$.minutes.$error"
						>Minutes input is required also value should be from range 1 to 59</span
					>
					<span class="input-error mb-0" v-if="editV$.seconds.$error"
						>Seconds input is required also value should be from range 0 to 59</span
					>
				</div>
			</div>

			<div class="flex justify-center mt-[16px] space-x-[12px]">
				<button
					class="button mx-0 bg-[#4D5F8C] text-[#B8C1D9] hover:text-[#4D5F8C] hover:bg-[#B8C1D9]"
					@click="editPopup = false"
				>
					Cancel
				</button>
				<button class="button mx-0" @click="saveTraining()">Save</button>
			</div>
		</template>
	</PopupsComponent>
</template>

<script setup>
//imports
import { computed, ref, reactive, watch } from 'vue'
import PopupsComponent from './PopupsComponent.vue'
import { useStoreNotes } from '../stores/storeNotes'
import { required, minValue, maxValue } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { useDateFormat } from '@vueuse/core'

//stores
const storeNotes = useStoreNotes()

//props
const props = defineProps({
	note: {
		type: Object,
	},
})

//variable handling delete popup is visible or not
const deletePopup = ref(false)

//variable handling edit popup is visible or not
const editPopup = ref(false)

//checking lenght of hours variable
const hoursLength = props.note.hours

//removing training
const removeGoal = () => {
	deletePopup.value = false
	storeNotes.removeTraining(props.note.id)
}

watch(editPopup, newVal => {
	if (!newVal) resetNoteDetails()
})

//edit popup note details
let noteDetails = reactive({ ...props.note })

//custom date validation
const checkDate = value => new Date(value).getTime() < Date.now()

//edit training popup validation
const editTrainingRules = computed(() => {
	return {
		date: {
			required,
			checkDate,
		},
		distance: {
			required,
			minValue: minValue(1),
		},
		hours: {
			minValue: minValue(0),
		},
		minutes: {
			required,
			minValue: minValue(1),
			maxValue: maxValue(59),
		},
		seconds: {
			required,
			minValue: minValue(0),
			maxValue: maxValue(59),
		},
	}
})

//saving edited training
const editV$ = useValidate(editTrainingRules, noteDetails)
const saveTraining = () => {
	editV$.value.$validate()
	if (!editV$.value.$error) {
		storeNotes.editTraining(props.note.id, noteDetails)
		editPopup.value = false
		editV$.value.$reset()
	}
}

//reseting noteDetails on closing popup
const resetNoteDetails = () => {
	noteDetails = { ...props.note }
	editV$.value.$reset()
}

//formatting distance value
const formatDistance = () => {
	if (noteDetails.distance !== '') noteDetails.distance = parseFloat(noteDetails.distance).toFixed(2)
	else noteDetails.distance = 0
}

//open edit popup
const openEditPopup = () => {
	noteDetails = { ...props.note }
	editPopup.value = true
}


</script>

<style lang="scss" scoped></style>

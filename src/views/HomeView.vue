<template>
	<main class="main">
		<NavbarComponent v-if="storeAuth.loaded" title="Running Diary"> </NavbarComponent>
		<div class="box p-[16px] pt-0 max-w-[600px] mx-auto">
			<button class="button" @click="addTrainingPopupVisible = true">Add running note</button>
			<span class="text-base text-white text-center mt-[16px] block" v-if="!runningNotes.length"
				>Didn't added any running notes yet. Do it now.</span
			>
			<TrainingComponent v-for="(note, index) in runningNotes" :key="index" :note="note" />
		</div>
	</main>

	<LoaderComponent v-if="!storeAuth.loaded" />

	<!-- add training popup -->
	<PopupsComponent v-model="addTrainingPopupVisible">
		<template #add-training>
			<h2 class="title">Add Training</h2>
			<div class="training-details flex flex-col space-y-[16px]">
				<div class="box" :class="{ 'text-red-500': v$.date.$error }">
					<label for="date" class="label"> Date </label>
					<input
						type="date"
						id="date"
						class="input border-[1px]"
						:class="{ 'border-red-500': v$.date.$error, 'border-[#6c7ca6]': !v$.date.$error }"
						v-model="trainingDetails.date"
						:min="minDateValue"
					/>
					<span class="input-error mb-0" v-if="v$.date.$error"
						>Date input is required also you cannot add training in future</span
					>
				</div>

				<div class="box" :class="{ 'text-red-500': v$.distance.$error }">
					<label for="distance" class="label">Distance(kilometers)</label>
					<input
						type="number"
						id="distance"
						placeholder="Distance"
						@focusout="formatDistance()"
						class="input border-[1px]"
						:class="{ 'border-red-500': v$.distance.$error, 'border-[#6c7ca6]': !v$.distance.$error }"
						v-model="trainingDetails.distance"
					/>
					<span class="input-error mb-0" v-if="v$.distance.$error">Distance input is required</span>
				</div>

				<div class="box">
					<label class="label" :class="{ 'text-red-500': v$.hours.$error || v$.minutes.$error || v$.seconds.$error }"
						>Time</label
					>
					<div class="time-details flex">
						<input
							type="number"
							class="input border-[1px]"
							:class="{ 'border-red-500': v$.hours.$error, 'border-[#6c7ca6]': !v$.hours.$error }"
							placeholder="HH"
							v-model="trainingDetails.hours"
						/>
						<input
							type="number"
							class="input border-[1px] mx-[12px]"
							:class="{ 'border-red-500': v$.minutes.$error, 'border-[#6c7ca6]': !v$.minutes.$error }"
							placeholder="MM"
							v-model="trainingDetails.minutes"
						/>
						<input
							type="number"
							class="input border-[1px]"
							:class="{ 'border-red-500': v$.seconds.$error, 'border-[#6c7ca6]': !v$.seconds.$error }"
							placeholder="SS"
							v-model="trainingDetails.seconds"
						/>
					</div>
					<span class="input-error mb-0" v-if="v$.hours.$error">Hours input should be greater than 0</span>
					<span class="input-error mb-0" v-if="v$.minutes.$error"
						>Minutes input is required and also value should be from range 1 to 59</span
					>
					<span class="input-error mb-0" v-if="v$.seconds.$error"
						>Seconds input is required also value should be from range 0 to 59</span
					>
				</div>
			</div>

			<div class="flex justify-center mt-[16px] space-x-[12px]">
				<button
					class="button mx-0 bg-[#4D5F8C] text-[#B8C1D9] hover:text-[#4D5F8C] hover:bg-[#B8C1D9]"
					@click="resetPopup()"
				>
					Cancel
				</button>
				<button class="button mx-0" @click="saveTraining()">Save</button>
			</div>
		</template>
	</PopupsComponent>

	<!-- no weight setted popup -->
	<PopupsComponent v-if="userWeight == ''">
		<template #add-weight>
			<h2 class="title">Add Weight</h2>
			<div class="details flex flex-col space-y-[16px] mt-[16px]">
				<p>
					Looks like you didn't add you current weight, body weight is needed for calculate burned calories during
					training, please provide you current weight into kilograms below:
				</p>

				<div class="box">
					<input
						type="number"
						class="input border-[1px]"
						:class="{
							'border-red-500 text-red-500 placeholder:text-red-500': weightInputError,
							'border-[#6c7ca6] text-[#6c7ca6] placeholder:text-[#6c7ca6]': !weightInputError,
						}"
						placeholder="Weight in kilograms"
						v-model="weightInput"
					/>
					<span class="input-error mb-0" v-if="weightInputError"
						>Weight value is required also value should be from range 1 to 199 kilograms</span
					>
				</div>

				<div class="flex justify-center mt-[16px] space-x-[12px]">
					<button
						class="button mx-0 bg-[#4D5F8C] text-[#B8C1D9] hover:text-[#4D5F8C] hover:bg-[#B8C1D9]"
						@click="storeAuth.logoutUser()"
					>
						Logout
					</button>
					<button class="button mx-0" @click="addWeight()">Add</button>
				</div>
			</div>
		</template>
	</PopupsComponent>

	<!-- reset test account data -->
	<PopupsComponent v-if="(notes.length !== 0 || goals.length !== 0) && isTestAccount && appVisited">
		<template #reset-test-account>
			<h2 class="title">Reset Data</h2>
			<p class="text-center mt-[16px]">
				Looks like someone already entered some data on test account, do you want to reset all data?
			</p>
			<div class="flex justify-center mt-[16px] space-x-[12px]">
				<button
					class="button mx-0 bg-[#4D5F8C] text-[#B8C1D9] hover:text-[#4D5F8C] hover:bg-[#B8C1D9]"
					@click="storeAuth.changeAppVisited()"
				>
					No
				</button>
				<button class="button mx-0" @click="storeAuth.resetTestData()">Yes</button>
			</div>
		</template>
	</PopupsComponent>
</template>

<script setup>
//imports
import { computed, reactive, ref, watch } from 'vue'
import { useStoreAuth } from '../stores/storeAuth'
import { useStoreNotes } from '../stores/storeNotes'
import { useStoreGoals } from '../stores/storeGoals'
import { useDateFormat } from '@vueuse/core'
import { required, minValue, maxValue } from '@vuelidate/validators'
import { useRouter } from 'vue-router'
import useValidate from '@vuelidate/core'
import NavbarComponent from '../components/NavbarComponent.vue'
import LoaderComponent from '../components/LoaderComponent.vue'
import TrainingComponent from '../components/TrainingComponent.vue'
import PopupsComponent from '../components/PopupsComponent.vue'

//router
const router = useRouter()

//stores
const storeAuth = useStoreAuth()
const storeNotes = useStoreNotes()
const storeGoals = useStoreGoals()

//notes from storeNotes
const runningNotes = computed(() => {
	return storeNotes.notes
})

// add training popup handler
const addTrainingPopupVisible = ref(false)

//variable storing add training popup inputs
const trainingDetails = reactive({
	date: '',
	distance: '',
	hours: '',
	minutes: '',
	seconds: '',
})

//setting todays date
const setTodayDate = () => {
	const formatted = useDateFormat(Date.now(), 'YYYY-MM-DD')
	trainingDetails.date = formatted.value
}

setTodayDate()

// reseting form on closing popup
const resetPopup = () => {
	addTrainingPopupVisible.value = false
	trainingDetails.distance = ''
	trainingDetails.hours = ''
	trainingDetails.minutes = ''
	trainingDetails.seconds = ''
	setTodayDate()
	v$.value.$reset()
}

//formatting distance
const formatDistance = () => {
	if (trainingDetails.distance !== '') trainingDetails.distance = parseFloat(trainingDetails.distance).toFixed(2)
	else trainingDetails.distance = 0
}

//watching variable which is handling add training popup if variable is false then reset popup details
watch(addTrainingPopupVisible, newVal => {
	if (!newVal) resetPopup()
})

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

//saving training
const v$ = useValidate(editTrainingRules, trainingDetails)
const saveTraining = () => {
	v$.value.$validate()
	if (!v$.value.$error) {
		storeNotes.saveTraining(trainingDetails)
		v$.value.$reset()
		resetPopup()
	}
}

//variable with user weight
const userWeight = computed(() => {
	return storeAuth.user.weight
})

//variable storing weight input
const weightInput = ref('')

//variable handlig showing weight input error
const weightInputError = ref(false)

const addWeight = () => {
	if (weightInput.value !== '' && weightInput.value >= 1 && weightInput.value <= 199) {
		weightInputError.value = false
		storeAuth.updateUserWeight(weightInput.value)
	} else {
		weightInputError.value = true
	}
}

//stuffs related to rest test account data
const notes = computed(() => {
	return storeNotes.notes
})

const goals = computed(() => {
	return storeGoals.goals
})

const appVisited = computed(() => {
	return storeAuth.appVisited
})

const isTestAccount = computed(() => {
	return storeAuth.isTestAccount
})

const dayOffset = 24 * 60 * 60 * 1000
const minDateValue = useDateFormat(Date.now() - 7 * dayOffset, 'YYYY-MM-DD')
</script>

<style lang="scss" scoped></style>

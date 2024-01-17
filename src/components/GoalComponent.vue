<template>
	<div class="goal p-[16px] bg-[#344573] text-[#8F9DBF] rounded-md relative overflow-hidden mb-[16px]">
		<div class="goal-header relative flex items-center justify-end">
			<h2 class="w-full text-center text-[22px] font-semibold">{{ title }}</h2>
			<div class="buttons flex">
				<button
					class="w-[20px] h-[20px] mr-[6px] bg-cover bg-center bg-[url('../assets/icons/edit.svg')]"
					:class="{ hidden: goal.status !== '' }"
					@click="isEditPopupVisible = true"
				></button>
				<button
					class="w-[20px] h-[20px] bg-cover bg-center bg-[url('../assets/icons/x.svg')]"
					@click="isRemovePopupVisible = true"
				></button>
			</div>
		</div>
		<div class="details-box mt-[16px]">
			<div class="box flex justify-between" v-if="goal.type === 'target'">
				<p class="font-semibold">Target:</p>
				<p>{{ goal.target }}<span v-if="goal.title === 'Lose Weight'">kg</span></p>
			</div>
			<div class="box flex justify-between">
				<p class="font-semibold">Target date:</p>
				<p>{{ goal.date }}</p>
			</div>

			<div class="box flex justify-between">
				<p class="font-semibold">Remaining days:</p>
				<p>{{ remainingDays }}</p>
			</div>

			<div class="weight-box" v-if="goal.title === 'Lose Weight'">
				<div class="flex justify-between">
					<p class="font-semibold">Current Weight:</p>
					<p>{{ currentWeight }}kg</p>
				</div>
				<div class="flex justify-between">
					<p class="font-semibold">To goal:</p>
					<p>{{ toAchiveTargetWeight }}kg</p>
				</div>
			</div>

			<div
				class="timebox flex justify-between"
				v-if="goal.type === 'target' && goal.minutes !== '' && goal.seconds !== ''"
			>
				<p class="font-semibold">Target Time:</p>
				<p>
					<span v-if="goal.hours !== 0">{{ goal.hours }}:</span><span v-if="minutesLength === 1">0</span
					>{{ goal.minutes }}:<span v-if="secondsLength === 1">0</span>{{ goal.seconds }}
				</p>
			</div>
		</div>

		<div class="progress-box" v-if="goal.type === 'progress'">
			<progress
				class="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:bg-green-600 [&::-moz-progress-bar]:bg-blue-400"
				:value="progressValue"
				:max="goal.target"
			></progress>
			<div class="progress-details flex justify-center">
				<span>{{ progressValue }}/</span>
				<span class="font-semibold">{{ goal.target }}</span>
			</div>
		</div>

		<div class="status flex justify-between" v-if="goal.status !== ''">
			<span class="font-semibold">Status:</span>
			<span class="text-red-500" v-if="goal.status === false">Failure</span>
			<span class="text-emerald-500" v-if="goal.status === true">Success</span>
		</div>
	</div>

	<!-- Remove Popup -->
	<PopupsComponent v-model="isRemovePopupVisible">
		<template #remove-popup>
			<div class="flex flex-col space-y-[12px]">
				<h2 class="title">Remove Goal</h2>
				<p class="text-center">Are you sure that you want do delete below goal?</p>
				<p><span class="font-bold">Title: </span>{{ title }}</p>
			</div>

			<div class="buttons">
				<div class="buttons flex justify-center space-x-[16px]">
					<button
						class="button mx-0 bg-[#4D5F8C] text-[#B8C1D9] hover:text-[#4D5F8C] hover:bg-[#B8C1D9]"
						@click="closePopup()"
					>
						Cancel
					</button>
					<button class="button mx-0" @click="removeGoal()">Remove</button>
				</div>
			</div>
		</template>
	</PopupsComponent>

	<!-- Edit Popup -->
	<PopupsComponent v-model="isEditPopupVisible" @close-popup="closePopup()">
		<template #edit-goal>
			<h2 class="title">Edit Goal</h2>
			<div
				class="input flex flex-col"
				:class="{ 'text-red-500': v$.title.$error }"
				v-if="goal.type === 'target' && goal.title !== 'Lose Weight'"
			>
				<label for="title">Title</label>
				<input
					type="text"
					id="title"
					class="input border-[1px] border-[#6C7CA6]"
					:class="{ 'border-red-500': v$.title.$error }"
					v-model="editPopup.title"
				/>
				<span class="label-error" v-if="v$.title.$error">Title input is required</span>
			</div>

			<div class="input flex flex-col" :class="{ 'text-red-500': v$.target.$error }">
				<label for="target">Target Value</label>
				<input
					type="number"
					id="target"
					class="input border-[1px] border-[#6C7CA6]"
					:class="{ 'border-red-500': v$.target.$error }"
					v-model="editPopup.target"
					@focusout="fixNumber"
				/>
				<span class="label-error" v-if="v$.target.$error"
					>Target Value need to be provided and value should be greater than 1</span
				>
			</div>
			<div class="input flex flex-col" :class="{ 'text-red-500': v$.date.$error }">
				<label for="date">Target Date</label>
				<input
					type="date"
					id="date"
					class="input border-[1px] border-[#6C7CA6]"
					:class="{ 'border-red-500': v$.date.$error }"
					v-model="editPopup.date"
				/>
				<span class="label-error" v-if="v$.date.$error"
					>Date need to be provided also you cannot set target date into past.</span
				>
			</div>

			<div class="buttons mt-[16px] flex justify-center space-x-[16px]">
				<button
					class="button mx-0 bg-[#4D5F8C] text-[#B8C1D9] hover:text-[#4D5F8C] hover:bg-[#B8C1D9]"
					@click="closePopup()"
				>
					Cancel
				</button>
				<button class="button mx-0" @click="editGoal()">Save</button>
			</div>
		</template>
	</PopupsComponent>
</template>

<script setup>
//imports
import { ref, computed, reactive, watch } from 'vue'
import { useStoreNotes } from '../stores/storeNotes'
import { useStoreGoals } from '../stores/storeGoals'
import { useStoreAuth } from '../stores/storeAuth'
import PopupsComponent from './PopupsComponent.vue'
import { required, minValue } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'

//stores
const storeNotes = useStoreNotes()
const storeGoals = useStoreGoals()
const storeAuth = useStoreAuth()

//props
const props = defineProps({
	goal: {
		type: Object,
	},
})

//variable handling popups
const isRemovePopupVisible = ref(false)
const isEditPopupVisible = ref(false)

//removing goal
const removeGoal = () => {
	isRemovePopupVisible.value = false
	storeGoals.deleteGoal(props.goal.id)
}

//stuffs related to edit popup
//variable for storing edit popup inputs
const editPopup = reactive({
	title: props.goal.title,
	target: props.goal.target,
	date: props.goal.date,
})

//fixing target value for 2 decimal points
const fixNumber = () => {
	editPopup.target = parseFloat(editPopup.target).toFixed(2)
}

//watching variable handling edit popup
watch(isEditPopupVisible, newVal => {
	if (!newVal) closePopup()
})

//reseting inputs od closing popup
const closePopup = () => {
	isEditPopupVisible.value = false
	editPopup.title = props.goal.title
	editPopup.target = props.goal.target
	editPopup.date = props.goal.date
}

//rules for validation
const checkDate = value => new Date(value).getTime() > Date.now()
const rules = computed(() => {
	return {
		title: { required },
		target: { required, minValue: minValue(1) },
		date: { required, checkDate },
	}
})

//validation
const v$ = useValidate(rules, editPopup)
const editGoal = () => {
	v$.value.$validate()
	if (!v$.value.$error) {
		storeGoals.editGoal(props.goal.id, editPopup)
		v$.value.$reset()
		closePopup()
	}
}

//Calculate remainings days to target date
let remainingDays
const calculateRemainingDays = () => {
	let dayOffset = 24 * 60 * 60 * 1000
	let timestampDifference = new Date(props.goal.date).getTime() - Date.now()
	remainingDays = (timestampDifference / dayOffset).toFixed(0)
}

calculateRemainingDays()

//recalculate remaining days on target date change
const targetDate = computed(() => props.goal.date)
watch(targetDate, newVal => {
	calculateRemainingDays()
})

const progressValue = ref(0)

//current weight value
const currentWeight = computed(() => {
	return storeAuth.user.weight
})

//stuffs related to lose weight goal
const toAchiveTargetWeight = ref('')
const targetVal = computed(() => props.goal.target)

//calculate weight difference
const calculateWeightDiff = () => {
	toAchiveTargetWeight.value = (currentWeight.value - targetVal.value).toFixed(2)
}

//recalculate wieght difference on weight target change
watch(targetVal, newVal => {
	if ((props.goal.title = 'Lose Weight')) {
		calculateWeightDiff()
		checkWeight()
	}
})

//checking length of minutes and seconds
const minutesLength = ref(0)
const secondsLength = ref(0)
const checkMinutesAndSeconds = () => {
	if (props.goal.minutes !== '' && props.goal.seconds !== '') {
		minutesLength.value = props.goal.minutes.toString().split('').length
		secondsLength.value = props.goal.seconds.toString().split('').length
	}
}

//check weight goal
const checkWeight = () => {
	if (Date.now() < props.goal.targetTimestampDate && currentWeight.value < parseFloat(props.goal.target)) {
		storeGoals.completeGoal(props.goal.id, true)
	} else if (Date.now() > props.goal.targetTimestampDate && currentWeight.value > parseFloat(props.goal.target)) {
		storeGoals.completeGoal(props.goal.id, false)
	} else {
		return
	}
}

//check progress goal
const checkProgress = () => {
	if (Date.now() < props.goal.targetTimestampDate && progressValue.value > parseInt(props.goal.target)) {
		storeGoals.completeGoal(props.goal.id, true)
	} else if (Date.now() > props.goal.targetTimestampDate && progressValue.value < parseInt(props.goal.target)) {
		storeGoals.completeGoal(props.goal.id, false)
	} else {
		return
	}
}

//check target goal
const checkTimeGoal = () => {
	const newNotes = storeNotes.getNotesFromRange(props.goal.addedTimestamp)
	let indexes = []
	newNotes.forEach((el, index) => {
		if (el.distance >= props.goal.target) {
			indexes.push(index)
		}
	})

	if (Date.now() > props.goal.targetTimestampDate) {
		storeGoals.completeGoal(props.goal.id, false)
	} else if (Date.now() < props.goal.targetTimestampDate) {
		if (props.goal.minutes !== '') {
			const goalTime =
				parseInt(props.goal.hours) * 60 + parseInt(props.goal.minutes) + parseInt((props.goal.seconds * 100) / 60) / 10
			indexes.forEach(el => {
				if (newNotes[el].time < goalTime) {
					storeGoals.completeGoal(props.goal.id, true)
				}
			})
		} else {
			indexes.forEach(el => {
				if (parseFloat(newNotes[el].distance) > parseFloat(props.goal.target)) {
					storeGoals.completeGoal(props.goal.id, true)
				}
			})
		}
	} else {
		return
	}
}

//variable for storing goal title
const title = ref('')

//checking goal title
switch (props.goal.title) {
	case 'distance':
		title.value = `Travel ${props.goal.target} km`
		progressValue.value = storeNotes.getDistanceCovered(props.goal.addedTimestamp - 24 * 60 * 60 * 1000)
		checkProgress()
		break
	case 'calories':
		title.value = `Burn ${props.goal.target} kcal`
		progressValue.value = storeNotes.getTotalBurnedCalories(props.goal.addedTimestamp - 24 * 60 * 60 * 1000)
		checkProgress()
		break
	case 'trainingNumber':
		title.value = `Finish ${props.goal.target} trainings`
		progressValue.value = storeNotes.getNumberOfTrainings(props.goal.addedTimestamp - 24 * 60 * 60 * 1000)
		checkProgress()
		break
	case 'Lose Weight':
		title.value = 'Lose Weight'
		calculateWeightDiff()
		checkWeight()
		break
	default:
		title.value = props.goal.title
		checkMinutesAndSeconds()
		checkTimeGoal()
		break
}
</script>

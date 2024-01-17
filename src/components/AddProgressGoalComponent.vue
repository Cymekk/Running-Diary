<template>
	<p class="text-center my-[16px] text-[20px] font-semibold">Goal Details</p>
	<div class="flex flex-col space-y-[12px]">
		<p class="text-center">What key value do you want do monitor?</p>
		<div class="box flex justify-between items-center flex-wrap">
			<div class="labels" :class="{ 'text-red-500': allInputs || isDistanceErr }">
				<input type="radio" id="distance" name="keyValue" value="distance" v-model="keyValue" />
				<label for="distance" class="ml-[6px]">Covered Distance</label>
			</div>
			<input
				v-model="distance"
				id="distance"
				type="number"
				class="input border-[1px] border-[#8F9DBF] w-2/5"
				:class="{ 'border-red-500 placeholder:text-red-500': isDistanceErr }"
				placeholder="amount of km"
				v-if="keyValue === 'distance'"
				@focusout="formatInput($event)"
			/>
			<span v-if="isDistanceErr" class="label-error text-center w-full"
				>Covered distance input must be filled and need to be grater than 0.</span
			>
		</div>

		<div class="box flex justify-between items-center flex-wrap">
			<div class="labels" :class="{ 'text-red-500': allInputs || isCaloriesErr }">
				<input type="radio" id="calories" name="keyValue" value="calories" v-model="keyValue" />
				<label for="calories" class="ml-[6px]">Burned Calories</label>
			</div>
			<input
				v-model="calories"
				id="calories"
				type="number"
				class="input border-[1px] border-[#8F9DBF] w-2/5"
				:class="{ 'border-red-500 placeholder:text-red-500': isCaloriesErr }"
				placeholder="burned calories"
				v-if="keyValue === 'calories'"
				@focusout="formatInput($event)"
			/>
			<span v-if="isCaloriesErr" class="label-error text-center"
				>Burned Calories need to be filled and need to be greater than 0.</span
			>
		</div>

		<div class="box flex justify-between items-center flex-wrap">
			<div class="labels" :class="{ 'text-red-500': allInputs || isNumberErr }">
				<input type="radio" id="trainingNumber" name="keyValue" value="trainingNumber" v-model="keyValue" />
				<label for="trainingNumber" class="ml-[6px]">Training Number</label>
			</div>
			<input
				v-model="numberOfTrainings"
				id="trainings"
				type="number"
				class="input border-[1px] border-[#8F9DBF] w-2/5"
				:class="{ 'border-red-500 placeholder:text-red-500': isNumberErr }"
				placeholder="number of trainings"
				v-if="keyValue === 'trainingNumber'"
				@focusout="formatInput($event)"
			/>
			<span v-if="isNumberErr" class="label-error text-center"
				>Number of trainings need to be filled and need to be greater than 0.</span
			>
		</div>
		<span class="label-error" v-if="allInputs">You need to select value which you need to monitor.</span>

		<div class="date" :class="{ 'text-red-500': dateErr }">
			<label for="date" class="label">Target Date</label>
			<input
				type="date"
				id="date"
				class="input border-[1px] border-[#8F9DBF]"
				:class="{ 'border-red-500': dateErr }"
				v-model="date"
			/>
			<span class="label-error text-center block" v-if="dateErr">Cannot set targed date in past.</span>
		</div>

		<button class="button" @click="validateDate">Save</button>
	</div>
</template>

<script setup>
//imports
import { useDateFormat } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useStoreGoals } from '../stores/storeGoals'

//store
const storeGoals = useStoreGoals()

const keyValue = ref('')

//variable for storing values from inputs
const distance = ref('')
const calories = ref('')
const numberOfTrainings = ref('')

//function which is setting today date for date input
const date = ref('')
const setTodayDate = () => {
	const formatted = useDateFormat(Date.now(), 'YYYY-MM-DD')
	date.value = formatted.value
}
setTodayDate()

//formating inputs
const formatInput = e => {
	const id = e.target.id

	switch (id) {
		case 'distance':
			if (distance.value !== '') distance.value = parseFloat(distance.value).toFixed(0)
			break
		case 'calories':
			if (calories.value !== '') calories.value = parseFloat(calories.value).toFixed(0)
			break
		case 'trainings':
			if (numberOfTrainings.value !== '') numberOfTrainings.value = parseFloat(numberOfTrainings.value).toFixed(0)
			break
		default:
			break
	}
}

//Validation
//variable for handling span with inputs error
const isDistance = ref(false)
const isCalories = ref(false)
const isTrainingNumber = ref(false)
const dateErr = ref(false)
const allInputs = ref(false)
const isDistanceErr = ref(false)
const isCaloriesErr = ref(false)
const isNumberErr = ref(false)

//Validate Date
const validateDate = () => {
	if (new Date(Date.now()).getTime() - 24 * 60 * 60 * 1000 > new Date(date.value).getTime()) {
		dateErr.value = true
	} else {
		validationInputs()
		dateErr.value = false
	}
}

//validation inputs
const validationInputs = () => {
	if (keyValue.value !== '') {
		allInputs.value = false
		switch (keyValue.value) {
			case 'distance':
				validateDistance()
				break
			case 'calories':
				validateCalories()
				break
			case 'trainingNumber':
				validateNumberOfTrainings()
				break
			default:
				break
		}
	} else {
		allInputs.value = true
	}
}

const validateDistance = () => {
	if (distance.value !== '' && distance.value > 0) {
		isDistanceErr.value = false
		let obj = {
			value: distance.value,
			title: keyValue.value,
			date: date.value,
		}
		storeGoals.saveProgressGoal(obj)
	} else {
		isDistanceErr.value = true
	}
}

const validateCalories = () => {
	if (calories.value !== '' && calories.value > 0) {
		isCaloriesErr.value = false
		let obj = {
			value: calories.value,
			title: keyValue.value,
			date: date.value,
		}
		storeGoals.saveProgressGoal(obj)
	} else {
		isCaloriesErr.value = true
	}
}

const validateNumberOfTrainings = () => {
	if (numberOfTrainings.value !== '' && numberOfTrainings.value > 0) {
		isNumberErr.value = false
		let obj = {
			value: numberOfTrainings.value,
			title: keyValue.value,
			date: date.value,
		}
		storeGoals.saveProgressGoal(obj)
	} else {
		isNumberErr.value = true
	}
}

//reseting error and input values
const resetDistance = () => {
	distance.value = ''
	isDistanceErr.value = false
}

const resetCalories = () => {
	calories.value = ''
	isCaloriesErr.value = false
}

const resetTrainingNumber = () => {
	numberOfTrainings.value = ''
	isNumberErr.value = false
}

//reseting errors and input value on change valure for monitoring
watch(keyValue, newVal => {
	switch (newVal) {
		case 'distance':
			resetCalories()
			resetTrainingNumber()
			break
		case 'calories':
			resetDistance()
			resetTrainingNumber()
			break
		case 'trainings':
			resetDistance()
			resetCalories()
			break
		default:
			break
	}
})
</script>

<style lang="scss" scoped>
input[type='date']::-webkit-calendar-picker-indicator {
	background-color: #b8c1d9;
}
</style>

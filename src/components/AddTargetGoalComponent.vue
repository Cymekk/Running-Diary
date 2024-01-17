<template>
	<div class="goal-details mt-[16px]">
		<div class="goal-header flex justify-center space-x-[16px] flex-wrap">
			<div
				class="box flex flex-col border-[1px] border-[#8F9DBF] p-[12px] rounded-md"
				:class="{ 'border-red-500 text-red-500': isGoalTypeSelected }"
			>
				<input type="radio" id="weight" class="mr-[4px]" name="goalDetails" value="weight" v-model="goalType" />
				<label for="weight">Lose weight</label>
			</div>

			<div
				class="box flex flex-col border-[1px] border-[#8F9DBF] p-[12px] rounded-md"
				:class="{ 'border-red-500 text-red-500': isGoalTypeSelected }"
			>
				<input type="radio" id="training" class="mr-[4px]" name="goalDetails" value="training" v-model="goalType" />
				<label for="training">Training Goal</label>
			</div>
			<span v-if="isGoalTypeSelected" class="w-full label-error text-center mt-[6px]"
				>Goal type need to be selected</span
			>
		</div>

		<div class="main-content">
			<div class="lose-weight" v-if="goalType === 'weight'">
				<label for="date" class="mt-[8px] label" :class="{ 'text-red-500': !isDateValid }">Target Date</label>
				<input
					type="date"
					id="date"
					v-model="date"
					class="input border-[1px] border-[#8F9DBF]"
					:class="{ 'border-red-500 text-red-500': !isDateValid }"
				/>
				<span class="label-error text-center block" v-if="!isDateValid">Cannot set target date in past.</span>

				<label for="weight" class="label mt-[12px]" :class="{ 'text-red-500': v$.target.$error }"
					>Goal weight in kilograms</label
				>
				<input
					type="number"
					class="input border-[1px] border-[#8F9DBF]"
					:class="{ 'text-red-500 placeholder:text-red-500': v$.target.$error }"
					placeholder="Goal weight"
					v-model="goalDetails.target"
					@focusout="formatGoalTarget"
				/>
				<span class="label-error text-center block" v-if="v$.target.$error"
					>Goal Weight need to be from range 1kg to 200kg</span
				>
			</div>

			<div class="training-goal" v-if="goalType === 'training'">
				<label for="title" class="label mt-[12px]" :class="{ 'text-red-500': v$.title.$error }">Goal Title</label>
				<input
					type="text"
					class="input border-[1px] border-[#8F9DBF]"
					placeholder="Goal Title"
					v-model="goalDetails.title"
					:class="{ 'border-red-500 placeholder:text-red-500': v$.title.$error }"
				/>
				<span class="label-error text-center block" v-if="v$.title.$error">Goal Title is required</span>

				<label for="date" class="mt-[8px] label" :class="{ 'text-red-500': !isDateValid }">Target Date</label>
				<input
					type="date"
					id="date"
					v-model="date"
					class="input border-[1px] border-[#8F9DBF]"
					:class="{ 'border-red-500 text-red-500': !isDateValid }"
				/>
				<span class="label-error text-center block" v-if="!isDateValid">Cannot set target date in past.</span>

				<label for="weight" class="label mt-[12px]" :class="{ 'text-red-500': v$.target.$error }"
					>Goal Distance in kilometers</label
				>
				<input
					type="number"
					class="input border-[1px] border-[#8F9DBF]"
					placeholder="Goal distance"
					v-model="goalDetails.target"
					:class="{ 'border-red-500 placeholder:text-red-500': v$.target.$error }"
					@focusout="formatGoalTarget"
				/>
				<span class="label-error text-center block" v-if="v$.target.$error"
					>Goal Distance is required and need to be from range 1km to 200km</span
				>

				<div class="time mt-[12px]" :class="{ 'text-red-500': isTimeSelected }">
					<p class="text-center">Do you want to add goal time?</p>

					<div class="options flex justify-center">
						<div
							class="box border-[1px] border-[#8F9DBF] p-[12px] rounded-md mr-[12px]"
							:class="{ 'border-red-500': isTimeSelected }"
						>
							<input type="radio" id="no" class="mr-[4px]" value="no" name="time" v-model="goalTime" />
							<label for="no">No</label>
						</div>
						<div
							class="box border-[1px] border-[#8F9DBF] p-[12px] rounded-md"
							:class="{ 'border-red-500': isTimeSelected }"
						>
							<input type="radio" id="yes" class="mr-[4px]" value="yes" name="time" v-model="goalTime" />
							<label for="yes">Yes</label>
						</div>
					</div>
				</div>
				<span class="label-error text-center block" v-if="isTimeSelected"
					>You need to select that do you want to add time or not</span
				>

				<div class="goal-time mt-[12px]" v-if="goalTime === 'yes'">
					<label class="label" :class="{ 'text-red-500': vTime.$error }">Goal Time</label>
					<div class="inputs flex">
						<input
							type="number"
							class="input border-[1px] border-[#8f9dbf] mr-[8px]"
							placeholder="hh"
							v-model="time.hours"
						/>
						<input
							type="number"
							class="input border-[1px] border-[#8f9dbf] mr-[8px]"
							placeholder="mm"
							v-model="time.minutes"
							:class="{ 'border-red-500 placeholder:text-red-500': vTime.minutes.$error }"
						/>
						<input
							type="number"
							class="input border-[1px] border-[#8f9dbf]"
							:class="{ 'border-red-500 placeholder:text-red-500': vTime.seconds.$error }"
							placeholder="ss"
							v-model="time.seconds"
						/>
					</div>
					<span v-if="vTime.$error" class="label-error block text-center"
						>Minutes and seconds inputs are required, additionally value need to be from 1 to 59 range</span
					>
				</div>
			</div>
		</div>

		<button class="button mt-[12px]" @click="saveTraining">Save</button>
	</div>
</template>

<script setup>
//imports
import { reactive, ref, watch, computed } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { required, minValue, maxValue } from '@vuelidate/validators'
import { useStoreGoals } from '../stores/storeGoals'
import useValidate from '@vuelidate/core'

//store
const storeGoals = useStoreGoals()

//variable which storing target goal ttype
const goalType = ref('')

//variable which storing that user want to add goal time or not
const goalTime = ref('')

//function which is setting today date for date input
const date = ref('')
const setTodayDate = () => {
	const formatted = useDateFormat(Date.now(), 'YYYY-MM-DD')
	date.value = formatted.value
}
setTodayDate()

//saving training
const isGoalTypeSelected = ref(false)
const saveTraining = () => {
	if (goalType.value !== '') {
		isGoalTypeSelected.value = false
		validateDate()
	} else {
		isGoalTypeSelected.value = true
	}
}

const goalDetails = reactive({
	title: '',
	target: '',
})

const isDateValid = ref(true)
const validateDate = () => {
	if (new Date(date.value).getTime() > Date.now() - 24 * 60 * 60 * 1000) {
		isDateValid.value = true
		switch (goalType.value) {
			case 'weight':
				validateWeight()
				break
			case 'training':
				validateTarget()
				break
			default:
				break
		}
	} else {
		isDateValid.value = false
	}
}

//validate ruls
const rules = computed(() => {
	return {
		title: {
			required,
		},
		target: {
			required,
			minValue: minValue(1),
			maxValue: maxValue(200),
		},
	}
})

const time = reactive({
	hours: '',
	minutes: '',
	seconds: '',
})

const timeRules = computed(() => {
	return {
		hours: {
			minValue: minValue(0),
		},
		minutes: {
			required,
			minValue: minValue(0),
			maxValue: maxValue(59),
		},
		seconds: {
			required,
			minValue: minValue(0),
			maxValue: maxValue(59),
		},
	}
})

const v$ = useValidate(rules, goalDetails)
const vTime = useValidate(timeRules, time)

const validateWeight = () => {
	v$.value.$validate()
	if (!v$.value.$error) {
		v$.value.$reset()
		storeGoals.saveTargetGoal(goalDetails, date.value, time)
	}
}

const isTimeSelected = ref(false)

const validateTarget = () => {
	if (goalTime.value !== '') {
		isTimeSelected.value = false
		if (goalTime.value === 'no') {
			v$.value.$validate()
			if (!v$.value.$error) {
				storeGoals.saveTargetGoal(goalDetails, date.value, time)
			}
		} else {
			if (time.hours === '') time.hours = 0
			v$.value.$validate()
			vTime.value.$validate()
			if (!v$.value.$error && !vTime.value.$error) {
				storeGoals.saveTargetGoal(goalDetails, date.value, time)
			}
		}
	} else {
		isTimeSelected.value = true
	}
}

//reseting goalDetails variable
const resetGoalDetails = () => {
	goalDetails.title = ''
	goalDetails.target = ''
	isDateValid.value = true
	isGoalTypeSelected.value = false
}

//watchers
watch(goalType, newVal => {
	resetGoalDetails()
	if (goalType.value === 'weight') {
		goalDetails.title = 'Lose Weight'
	}
	v$.value.$reset()
})

watch(date, newVal => {
	if (new Date(date.value).getTime() > Date.now() - 24 * 60 * 60 * 1000) {
		isDateValid.value = true
	} else {
		isDateValid.value = false
	}
})

watch(goalTime, newVal => {
	isTimeSelected.value = false
	vTime.value.$reset()
})

//formatting goal target to 2 decimals mark
const formatGoalTarget = () => {
	goalDetails.target = parseFloat(goalDetails.target).toFixed(2)
}
</script>

<style lang="scss" scoped>
input[type='date']::-webkit-calendar-picker-indicator {
	background-color: #b8c1d9;
}
</style>

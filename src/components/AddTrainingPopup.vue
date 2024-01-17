<template>
	<div
		class="fixed inset-0 bg-black/50 flex items-center justify-center transition-transform duration-500"
		:class="{ '-translate-y-[100%]': !modelValue, 'translate-y-0': modelValue }"
	>
		<div
			class="popup-body bg-[#101D40] text-[#6C7CA6] w-4/5 max-w-[400px] p-[32px] rounded-md font-semibold shadow-[0_0_2px_2px_rgba(108,124,166,0.3)]"
			ref="targetRef"
		>
			<h2 class="title mb-[16px]">Add Training</h2>
			<div class="inputs">
				<label for="date" class="label text-[20px]" :class="{ 'label-error': dateErr }">Date:</label>
				<input
					type="date"
					id="date"
					class="input border-[#6C7CA6] border-[1px]"
					:class="{
						'shadow-[0_0_5px_5px_rgba(239,68,68,0.8)] border-[rgba(239,68,68,0.8)] placeholder:text-red-500': dateErr,
					}"
					v-model="trainingDetails.date"
					min="2023-01-01"
					max="2050-12-31"
				/>
				<span class="input-error" v-if="dateErr">You cannot add your training in future.!</span>
				<label for="distance" class="label text-[20px] mt-[16px]" :class="{ 'label-error': v$.distance.$error }"
					>Distance</label
				>
				<input
					type="number"
					class="input border-[#6C7CA6] border-[1px]"
					:class="{
						'shadow-[0_0_5px_5px_rgba(239,68,68,0.8)] border-[rgba(239,68,68,0.8)] placeholder:text-red-500':
							v$.distance.$error,
					}"
					id="distance"
					placeholder="Covered distance in kilometers"
					v-model="trainingDetails.distance"
					@focusout="formatDistance()"
				/>
				<span class="input-error" v-if="v$.distance.$error"
					>Covered distance is required and value should be greater than 0</span
				>

				<label
					for="time"
					class="label text-[20px] mt-[16px]"
					:class="{ 'label-error': v$.hours.$error || v$.minutes.$error || v$.seconds.$error }"
					>Time:</label
				>
				<div class="time-inputs flex space-x-[8px]">
					<input
						type="number"
						class="input border-[#6C7CA6] border-[1px]"
						:class="{
							'shadow-[0_0_5px_5px_rgba(239,68,68,0.8)] border-[rgba(239,68,68,0.8)] placeholder:text-red-500':
								v$.hours.$error,
						}"
						placeholder="hours"
						v-model="trainingDetails.hours"
					/>
					<input
						type="number"
						class="input border-[#6C7CA6] border-[1px]"
						:class="{
							'shadow-[0_0_5px_5px_rgba(239,68,68,0.8)] border-[rgba(239,68,68,0.8)] placeholder:text-red-500':
								v$.minutes.$error,
						}"
						placeholder="minutes"
						v-model="trainingDetails.minutes"
					/>
					<input
						type="number"
						class="input border-[#6C7CA6] border-[1px]"
						:class="{
							'shadow-[0_0_5px_5px_rgba(239,68,68,0.8)] border-[rgba(239,68,68,0.8)] placeholder:text-red-500':
								v$.seconds.$error,
						}"
						placeholder="seconds"
						v-model="trainingDetails.seconds"
					/>
				</div>
				<span class="input-error" v-if="v$.hours.$error || v$.minutes.$error || v$.seconds.$error"
					>Minutes input is required and value need to 1-59 range, seconds inputs is required and value should be from
					1-59 range
				</span>
			</div>
			<div class="buttons-box flex justify-center space-x-[16px] mt-[32px]">
				<button
					class="button mx-0 bg-[#4D5F8C] text-[#B8C1D9] hover:text-[#4D5F8C] hover:bg-[#B8C1D9]"
					@click="closePopup"
				>
					Cancel
				</button>
				<button class="button mx-0" @click="saveTraining()">Save</button>
			</div>
		</div>
	</div>
</template>

<script setup>
//imports
import { ref, reactive, computed } from 'vue'
import { required, minValue, maxValue } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { useStoreNotes } from '../stores/storeNotes'
import { onClickOutside, useDateFormat } from '@vueuse/core'

//props
const props = defineProps({
	modelValue: {
		type: Boolean,
	},
})

//emits
const emit = defineEmits(['update:modelValue'])

//close add training popup
const closePopup = () => {
	emit('update:modelValue', false)
	resetInputs()
	v$.value.$reset()
}

//close on clicking outside popup body
const targetRef = ref(null)

onClickOutside(targetRef, closePopup)

//store
const storeNotes = useStoreNotes()

//reactive variable for storing training details
const trainingDetails = reactive({
	date: '',
	distance: '',
	hours: '',
	minutes: '',
	seconds: '',
})

//rules for validation
const rules = computed(() => {
	return {
		distance: {
			required,
			minValue: minValue(0),
		},
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
			minValue: minValue(1),
			maxValue: maxValue(59),
		},
	}
})

//variable for handling date input error
const dateErr = ref(false)

const v$ = useValidate(rules, trainingDetails)
//function for storing training
const saveTraining = () => {
	if (trainingDetails.date === '' || Date.parse(trainingDetails.date) > Date.now()) {
		dateErr.value = true
	} else {
		dateErr.value = false
		v$.value.$validate()
		if (trainingDetails.hours === '') {
			trainingDetails.hours = 0
		}
		if (!v$.value.$error) {
			storeNotes.saveTraining(trainingDetails)
			closePopup()
		}
	}
}

//function for formatting distance value for 2 decimal points
const formatDistance = () => {
	if (trainingDetails.distance !== '') {
		trainingDetails.distance = parseFloat(trainingDetails.distance).toFixed(2)
	}
}

//reset inputs
const resetInputs = () => {
	trainingDetails.distance = ''
	trainingDetails.hours = ''
	trainingDetails.minutes = ''
	trainingDetails.seconds = ''
	dateErr.value = false
	setTodayDate()
}

//function which is setting today date for date input
const setTodayDate = () => {
	const formatted = useDateFormat(Date.now(), 'YYYY-MM-DD')
	trainingDetails.date = formatted.value
}

setTodayDate()
</script>

<style lang="scss" scoped>
input[type='date']::-webkit-calendar-picker-indicator {
	background-color: #b8c1d9;
}
</style>

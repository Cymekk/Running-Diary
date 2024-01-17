<template>
	<div class="flex flex-col">
		<select @change="showYear($event)" class="p-[6px] rounded-md bg-transparent border-[1px] border-[#8F9DBF]">
			<option class="bg-[#101D40] my-[6px]" v-for="(year, index) in years" :value="year">
				{{ year }}
			</option>
		</select>
		<div class="flex justify-between mt-[16px] pb-[4px] border-b-[1px] border-[#8F9DBF]">
			<span>Number of trainings:</span>
			<span>{{ storeNotes.totalNotesCount }}</span>
		</div>
		<div class="flex justify-between mt-[16px] pb-[4px] border-b-[1px] border-[#8F9DBF]">
			<span>Total amount of time:</span>
			<div v-if="storeNotes.getTotalTime">
				<span>{{ hours }}h:</span>
				<span>{{ minutes }}m:</span>
				<span>{{ seconds }}s</span>
			</div>
		</div>
		<div class="flex justify-between mt-[16px] pb-[4px] border-b-[1px] border-[#8F9DBF]">
			<span>Total number of burned calories:</span>
			<span v-if="storeNotes.getTotalCalories !== 0">{{ storeNotes.getTotalCalories }} kcal</span>
			<span v-if="storeNotes.getTotalCalories == 0">----</span>
		</div>
		<div class="flex justify-between mt-[16px] pb-[4px] border-b-[1px] border-[#8F9DBF]">
			<span>Longest run:</span>
			<span v-if="storeNotes.getLongestRun !== 0">{{ storeNotes.getLongestRun }} km</span>
			<span v-if="storeNotes.getLongestRun == 0">----</span>
		</div>
		<div class="flex justify-between mt-[16px] pb-[4px] border-b-[1px] border-[#8F9DBF]">
			<span>Fastest 5km:</span>
			<span v-if="storeNotes.getFastest5km">
				<span v-if="storeNotes.getFastest5km.hours"
					><span v-if="storeNotes.getFastest5km.hours.toString().split('').length == 1"></span
					>{{ storeNotes.getFastest5km.hours }}:</span
				>
				<span v-if="storeNotes.getFastest5km.minutes"
					><span v-if="storeNotes.getFastest5km.minutes.toString().split('').length == 1"></span
					>{{ storeNotes.getFastest5km.minutes }}:</span
				>
				<span v-if="storeNotes.getFastest5km.seconds"
					><span v-if="storeNotes.getFastest5km.seconds.toString().split('').length == 1"></span
					>{{ storeNotes.getFastest5km.seconds }}</span
				>
			</span>
			<span v-if="!storeNotes.getFastest5km">----</span>
		</div>
		<div class="flex justify-between mt-[16px] pb-[4px] border-b-[1px] border-[#8F9DBF]">
			<span>Fastest 10km:</span>
			<span v-if="storeNotes.getFastest10km">
				<span v-if="storeNotes.getFastest10km.hours"
					><span v-if="storeNotes.getFastest10km.hours.toString().split('').length == 1">0</span
					>{{ storeNotes.getFastest10km.hours }}:</span
				>
				<span v-if="storeNotes.getFastest10km.minutes"
					><span v-if="storeNotes.getFastest10km.minutes.toString().split('').length == 1">0</span
					>{{ storeNotes.getFastest10km.minutes }}:</span
				>
				<span v-if="storeNotes.getFastest10km.seconds"
					><span v-if="storeNotes.getFastest10km.seconds.toString().split('').length == 1">0</span
					>{{ storeNotes.getFastest10km.seconds }}</span
				>
			</span>
			<span v-if="!storeNotes.getFastest10km">----</span>
		</div>

		<div class="flex justify-between mt-[16px] pb-[4px] border-b-[1px] border-[#8F9DBF]">
			<span>Fastest half-marathon:</span>
			<span v-if="storeNotes.getHalfMarathon">
				<span v-if="storeNotes.getHalfMarathon.hours"
					><span v-if="storeNotes.getHalfMarathon.hours.toString().split('').length == 1">0</span
					>{{ storeNotes.getHalfMarathon.hours }}:</span
				>
				<span v-if="storeNotes.getHalfMarathon.minutes"
					><span v-if="storeNotes.getHalfMarathon.minutes.toString().split('').length == 1">0</span
					>{{ storeNotes.getHalfMarathon.minutes }}:</span
				>
				<span v-if="storeNotes.getHalfMarathon.seconds"
					><span v-if="storeNotes.getHalfMarathon.seconds.toString().split('').length == 1">0</span
					>{{ storeNotes.getHalfMarathon.seconds }}</span
				>
			</span>
			<span v-if="!storeNotes.getHalfMarathon">----</span>
		</div>
		<div class="flex justify-between mt-[16px] pb-[4px] border-b-[1px] border-[#8F9DBF]">
			<span>Fastest marathon:</span>
			<span v-if="storeNotes.getMarathon">
				<span v-if="storeNotes.getMarathon.hours"
					><span v-if="storeNotes.getMarathon.hours.toString().split('').length == 1">0</span
					>{{ storeNotes.getMarathon.hours }}:</span
				>
				<span v-if="storeNotes.getMarathon.minutes"
					><span v-if="storeNotes.getMarathon.minutes.toString().split('').length == 1">0</span
					>{{ storeNotes.getMarathon.minutes }}:</span
				>
				<span v-if="storeNotes.getMarathon.seconds"
					><span v-if="storeNotes.getMarathon.seconds.toString().split('').length == 1">0</span
					>{{ storeNotes.getMarathon.seconds }}</span
				>
			</span>
			<span v-if="!storeNotes.getMarathon">----</span>
		</div>
		<ChartComponent :sumOfKilometers="sumOfKilometers" />
	</div>
</template>

<script setup>
//imports
import { ref, computed, onMounted } from 'vue'
import { useStoreNotes } from '../stores/storeNotes'
import ChartComponent from './ChartComponent.vue'

//store
const storeNotes = useStoreNotes()

//get total time on trainings
const totalTime = computed(() => {
	return storeNotes.getTotalTime
})

//calculate hours in trainings
const hours = computed(() => {
	return (totalTime.value.toString().split('.')[0] / 60).toString().split('.')[0]
})
//calculate minutes in trainings
const minutes = computed(() => {
	return (((totalTime.value.toString().split('.')[0] / 60).toFixed(2).toString().split('.')[1] * 60) / 100)
		.toString()
		.split('.')[0]
})

//calculate seconds in trainings
const seconds = computed(() => {
	return ((totalTime.value.toString().split('.')[1] * 60) / 100).toString().split('.')[0]
})

//getting training notes
const trainingNotes = computed(() => {
	return storeNotes.notes
})

//variable with current year
const year = new Date().getFullYear()

//filter training notes by year
storeNotes.filterNotesByYear(year)

//variable which store years for select > options
let years = []

//getting years from trainig notes, if there isn't any training notes years contains only current year
const fillYearsOption = () => {
	if (trainingNotes.value.length !== 0) {
		trainingNotes.value.forEach(el => {
			if (!years.includes(new Date(el.date).getFullYear())) {
				years.push(new Date(el.date).getFullYear())
			}
		})
		years.sort((a, b) => a - b)
	} else years.push(year)
}

//doing some stuffs onMounted hook
onMounted(() => {
	let allOptions = document.querySelectorAll('option')
	let index = years.indexOf(year)
	allOptions[index].setAttribute('selected', true)
	storeNotes.getFastest5km
	storeNotes.getFastest10km
	storeNotes.getTotalCalories
	storeNotes.getHalfMarathon
	storeNotes.getMarathon
	storeNotes.getTotalTime
})

//function which refresh statistics on year change
const showYear = e => {
	storeNotes.filterNotesByYear(e.target.value)
	storeNotes.getFastest5km
	storeNotes.getFastest10km
	storeNotes.getTotalCalories
	storeNotes.getHalfMarathon
	storeNotes.getMarathon
	storeNotes.getTotalTime
	calculateKilometers()
}

const notes = computed(() => {
	return storeNotes.filteredNotesByYear
})

//variable which store how many kilometers you traveled each month
let sumOfKilometers = []

//function which calculate how many kilometers you traveled each month
const calculateKilometers = () => {
	sumOfKilometers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	const kilometers = []

	for (let i = 0; i < 12; i++) {
		kilometers.push([])
	}

	notes.value.forEach(el => {
		let index = new Date(el.date).getMonth()
		kilometers[index].push(el.distance)
	})

	kilometers.forEach((el, index) => {
		if (el.length !== 0) {
			let arrIndex = 0
			let total = 0
			el.forEach(el => {
				arrIndex = index
				total += parseFloat(el)
			})

			sumOfKilometers[arrIndex] += total
		}
	})
}

calculateKilometers()
fillYearsOption()
</script>

<style lang="scss" scoped></style>

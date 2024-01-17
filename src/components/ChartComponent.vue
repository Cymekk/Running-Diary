<template>
	<div>
		<h2 class="title my-[32px]">Chart</h2>
		<div
			class="canvas-box bg-[#1F2F59] p-[16px] rounded-md relative overflow-hidden shadow-[0_0px_10px_2px_rgba(143,157,191,0.3)]"
		>
			<canvas ref="runningChartEl"></canvas>
			<div
				class="no-data absolute inset-0 bg-[#101D40]/80 flex justify-center items-center"
				v-if="kilometersScore === 0"
			>
				<span class="text-[24px]">No Data</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import Chart from 'chart.js/auto'

const runningChartEl = ref(null)
const runningChart = ref(null)

onMounted(() => {
	showChart()
})

const props = defineProps({
	sumOfKilometers: {
		type: Array,
	},
})

const kilometers = computed(() => {
	return [...props.sumOfKilometers]
})

const labels = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

let kilometersScore = ref(0)

const showChart = () => {
	if (runningChart.value) {
		runningChart.value.destroy()
	}
	runningChart.value = new Chart(runningChartEl.value.getContext('2d'), {
		type: 'bar',
		data: {
			labels: [...labels],
			datasets: [
				{
					data: [...kilometers.value],
					backgroundColor: ['#8F9DBF'],
					color: '#fff',
				},
			],
		},

		options: {
			responsive: true,
			plugins: {
				legend: {
					display: false,
				},

				title: {
					display: true,
					text: 'Kilometers traveled per month',
					color: '#8F9DBF',
					padding: {
						bottom: 15,
					},

					font: {
						size: 16,
					},
				},
			},
			scales: {
				y: {
					ticks: { color: '#8F9DBF', beginAtZero: true },
					grid: { color: 'rgba(143,157,191, 0.2)' },
				},
				x: {
					ticks: { color: '#8F9DBF', beginAtZero: true },
					grid: { color: 'rgba(143,157,191, 0.2)' },
				},
			},
		},
	})

	kilometersScore.value = 0

	kilometers.value.forEach(el => {
		kilometersScore.value += el
	})
}

watch(kilometers, newVal => {
	showChart()
})
</script>

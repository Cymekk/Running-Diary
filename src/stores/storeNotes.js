import { defineStore } from 'pinia'
import { useStoreAuth } from './storeAuth'

let storeAuth

export const useStoreNotes = defineStore('storeNotes', {
	state: () => {
		return {
			notes: [],
		}
	},
	actions: {
		init() {
			storeAuth = useStoreAuth()
		},

		saveTraining(trainingDetails) {
			const sumTime = trainingDetails.hours * 60 + trainingDetails.minutes + (trainingDetails.seconds * 100) / 6000
			const paceArray = (sumTime / trainingDetails.distance).toString().split('.')
			const seconds = ((parseFloat('0.' + paceArray[paceArray.length - 1]) * 60) / 100).toFixed(2)
			const paceMinutes = paceArray[0]
			const paceSeconds = seconds.toString().split('.')

			let obj = {}
			obj.date = Date.now()
			obj.distance = trainingDetails.distance
			obj.time =
				trainingDetails.hours.toString() +
				'h' +
				':' +
				trainingDetails.minutes.toString() +
				'm' +
				':' +
				trainingDetails.seconds.toString() +
				's'
			obj.avgPace = paceMinutes.toString() + ':' + paceSeconds[paceSeconds.length - 1]
			obj.avgSpeed = (60 / parseFloat(paceArray.join('.')).toFixed(2)).toFixed(2)
			obj.burnedCalories = trainingDetails.distance * storeAuth.user.weight

			this.notes.push(obj)
		},
	},
	getters: {},
})

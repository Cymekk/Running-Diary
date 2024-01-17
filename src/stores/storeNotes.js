import { defineStore } from 'pinia'
import { useStoreAuth } from './storeAuth'
import {
	collection,
	query,
	addDoc,
	orderBy,
	onSnapshot,
	QuerySnapshot,
	deleteDoc,
	doc,
	updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/index'

let storeAuth
let notesSnapshot

export const useStoreNotes = defineStore('storeNotes', {
	state: () => {
		return {
			notes: [],
			notesId: [],
			filteredNotesByYear: [],
		}
	},
	actions: {
		init() {
			storeAuth = useStoreAuth()
			this.getNotes()
		},

		async getNotes() {
			const q = query(collection(db, 'runningNotes', storeAuth.user.id, 'trainings'), orderBy('timestamp', 'asc'))
			notesSnapshot = onSnapshot(q, querySnapshot => {
				this.notes = []
				querySnapshot.forEach(doc => {
					let training = {
						id: doc.id,
						date: doc.data().date,
						avgPace: doc.data().avgPace,
						avgSpeed: doc.data().avgSpeed,
						burnedCalories: doc.data().burnedCalories,
						distance: doc.data().distance,
						hours: doc.data().hours,
						minutes: doc.data().minutes,
						seconds: doc.data().seconds,
						time: doc.data().time,
					}

					this.notes.unshift(training)
					this.notesId.unshift(training.id)
				})
			})
		},

		async saveTraining(trainingDetails) {
			const sumTime = trainingDetails.hours * 60 + trainingDetails.minutes + (trainingDetails.seconds * 100) / 6000
			const paceArray = (sumTime / trainingDetails.distance).toString().split('.')
			const seconds = ((parseFloat('0.' + paceArray[paceArray.length - 1]) * 60) / 100).toFixed(2)
			const paceMinutes = paceArray[0]
			const paceSeconds = seconds.toString().split('.')

			await addDoc(collection(db, 'runningNotes', storeAuth.user.id, 'trainings'), {
				date: trainingDetails.date,
				time: trainingDetails.hours * 60 + trainingDetails.minutes + (trainingDetails.seconds * 100) / 6000,
				timestamp: new Date(trainingDetails.date).getTime(),
				distance: trainingDetails.distance,
				hours: trainingDetails.hours,
				minutes: trainingDetails.minutes,
				seconds: trainingDetails.seconds,
				avgPace: paceMinutes.toString() + ':' + paceSeconds[paceSeconds.length - 1],
				avgSpeed: (60 / parseFloat(paceArray.join('.')).toFixed(2)).toFixed(2),
				burnedCalories: (trainingDetails.distance * storeAuth.user.weight).toFixed(2),
			})
		},

		async editTraining(id, trainingDetails) {
			const sumTime = trainingDetails.hours * 60 + trainingDetails.minutes + (trainingDetails.seconds * 100) / 6000
			const paceArray = (sumTime / trainingDetails.distance).toString().split('.')
			const seconds = ((parseFloat('0.' + paceArray[paceArray.length - 1]) * 60) / 100).toFixed(2)
			const paceMinutes = paceArray[0]
			const paceSeconds = seconds.toString().split('.')

			const docRef = doc(db, 'runningNotes', storeAuth.user.id, 'trainings', id)

			await updateDoc(docRef, {
				date: trainingDetails.date,
				time: trainingDetails.hours * 60 + trainingDetails.minutes + (trainingDetails.seconds * 100) / 6000,
				distance: trainingDetails.distance,
				hours: trainingDetails.hours,
				minutes: trainingDetails.minutes,
				seconds: trainingDetails.seconds,
				avgPace: paceMinutes.toString() + ':' + paceSeconds[paceSeconds.length - 1],
				avgSpeed: (60 / parseFloat(paceArray.join('.')).toFixed(2)).toFixed(2),
				burnedCalories: (trainingDetails.distance * storeAuth.user.weight).toFixed(2),
			})
		},

		async removeTraining(id) {
			await deleteDoc(doc(db, 'runningNotes', storeAuth.user.id, 'trainings', id))
		},

		clearNotesSnapshot() {
			if (notesSnapshot) notesSnapshot()
		},

		removeAllNotes() {
			this.notesId.forEach(el => {
				deleteDoc(doc(db, 'runningNotes', storeAuth.user.id, 'trainings', el))
			})
		},
	},
	getters: {
		filterNotesByYear: state => {
			state.filteredNotesByYear = []
			return year =>
				(state.filteredNotesByYear = state.notes.filter(el => {
					return new Date(el.date).getFullYear() == year
				}))
		},

		totalNotesCount: state => {
			return state.filteredNotesByYear.length
		},

		getTotalTime: state => {
			let totalTime = 0
			state.filteredNotesByYear.forEach(el => {
				totalTime += el.time
			})

			return totalTime.toFixed(2)
		},

		getTotalCalories: state => {
			let totalCal = 0
			state.filteredNotesByYear.forEach(el => {
				totalCal += parseFloat(el.burnedCalories)
			})

			return totalCal
		},

		getLongestRun: state => {
			let array = []
			array = state.filteredNotesByYear.sort((a, b) => a.distance - b.distance)
			if (array.length !== 0) {
				return array[array.length - 1].distance
			} else {
				return 0
			}
		},

		getFastest5km: state => {
			let fastest5Km = []
			fastest5Km = state.filteredNotesByYear.filter(el => el.distance >= 5.0)
			fastest5Km = fastest5Km.sort((a, b) => a.time - b.time)
			return fastest5Km[0]
		},

		getFastest10km: state => {
			let fastest10Km = []
			fastest10Km = state.filteredNotesByYear.filter(el => el.distance >= 10.0)
			fastest10Km = fastest10Km.sort((a, b) => a.time - b.time)
			return fastest10Km[0]
		},

		getHalfMarathon: state => {
			let halfMarathon = []
			halfMarathon = state.filteredNotesByYear.filter(el => el.distance >= 21.0)
			halfMarathon = halfMarathon.sort((a, b) => a.time - b.time)
			return halfMarathon[0]
		},

		getMarathon: state => {
			let marathon = []
			marathon = state.filteredNotesByYear.filter(el => el.distance >= 42.0)
			marathon = marathon.sort((a, b) => a.time - b.time)
			return marathon[0]
		},

		getNumberOfTrainings: state => {
			let newNotes = []
			return timestamp => {
				newNotes = state.notes.filter(el => {
					return new Date(el.date).getTime() > timestamp
				})
				return newNotes.length
			}
		},

		getTotalBurnedCalories: state => {
			let newNotes = []
			let totalCal
			return timestamp => {
				totalCal = 0
				newNotes = state.notes.filter(el => {
					return new Date(el.date).getTime() > timestamp
				})

				newNotes.forEach(el => {
					totalCal += parseFloat(el.burnedCalories)
				})

				return totalCal.toFixed(0)
			}
		},

		getDistanceCovered: state => {
			let newNotes = []
			let totalDistance
			return timestamp => {
				totalDistance = 0
				newNotes = state.notes.filter(el => {
					return new Date(el.date).getTime() > timestamp
				})

				newNotes.forEach(el => {
					totalDistance += parseFloat(el.distance)
				})

				return totalDistance.toFixed(2)
			}
		},

		getNotesFromRange: state => {
			let newNotes = []
			return timestamp => {
				newNotes = state.notes.filter(el => {
					return new Date(el.date).getTime() > timestamp - 24 * 60 * 60 * 1000
				})

				return newNotes
			}
		},
	},
})

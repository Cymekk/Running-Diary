import { defineStore } from "pinia"
import { useStoreAuth } from "./storeAuth"
import {
	collection,
	query,
	addDoc,
	orderBy,
	onSnapshot,
	QuerySnapshot,
	deleteDoc,
	doc,
} from "firebase/firestore"
import { db } from "../firebase/index"

let storeAuth
let notesSnapshot

export const useStoreNotes = defineStore("storeNotes", {
	state: () => {
		return {
			notes: [],
		}
	},
	actions: {
		init() {
			storeAuth = useStoreAuth()
			this.getNotes()
		},

		async getNotes() {
			const q = query(
				collection(db, "runningNotes", storeAuth.user.id, "trainings"),
				orderBy("timestamp", "asc")
			)
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
						time: doc.data().time,
					}

					this.notes.unshift(training)
				})
			})
		},

		async saveTraining(trainingDetails) {
			const sumTime =
				trainingDetails.hours * 60 +
				trainingDetails.minutes +
				(trainingDetails.seconds * 100) / 6000
			const paceArray = (sumTime / trainingDetails.distance)
				.toString()
				.split(".")
			const seconds = (
				(parseFloat("0." + paceArray[paceArray.length - 1]) * 60) /
				100
			).toFixed(2)
			const paceMinutes = paceArray[0]
			const paceSeconds = seconds.toString().split(".")

			await addDoc(
				collection(db, "runningNotes", storeAuth.user.id, "trainings"),
				{
					date: trainingDetails.date,
					timestamp: Date.now(),
					distance: trainingDetails.distance,
					time:
						trainingDetails.hours.toString() +
						"h" +
						":" +
						trainingDetails.minutes.toString() +
						"m" +
						":" +
						trainingDetails.seconds.toString() +
						"s",
					avgPace:
						paceMinutes.toString() + ":" + paceSeconds[paceSeconds.length - 1],
					avgSpeed: (60 / parseFloat(paceArray.join(".")).toFixed(2)).toFixed(
						2
					),
					burnedCalories: trainingDetails.distance * storeAuth.user.weight,
				}
			)
		},

		async removeTraining(id) {
			await deleteDoc(
				doc(db, "runningNotes", storeAuth.user.id, "trainings", id)
			)
		},
	},
	getters: {},
})

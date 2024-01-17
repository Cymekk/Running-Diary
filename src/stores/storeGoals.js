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
let goalsSnapshot

export const useStoreGoals = defineStore('storeGoals', {
	state: () => {
		return {
			goals: [],
			goalsId: [],
		}
	},
	actions: {
		init() {
			storeAuth = useStoreAuth()
			this.getGoals()
		},

		async getGoals() {
			const q = query(collection(db, 'runningNotes', storeAuth.user.id, 'goals'))
			goalsSnapshot = onSnapshot(q, querySnapshot => {
				this.goals = []
				querySnapshot.forEach(doc => {
					let training = {
						id: doc.id,
						title: doc.data().title,
						target: doc.data().target,
						date: doc.data().targetDate,
						targetTimestampDate: doc.data().targetTimestampDate,
						addedTimestamp: doc.data().addedTimestamp,
						type: doc.data().type,
						completed: doc.data().completed,
						hours: doc.data().hours,
						minutes: doc.data().minutes,
						seconds: doc.data().seconds,
						status: doc.data().status,
					}

					this.goalsId.unshift(training.id)
					this.goals.unshift(training)
				})
			})
		},

		async saveProgressGoal(obj) {
			await addDoc(collection(db, 'runningNotes', storeAuth.user.id, 'goals'), {
				title: obj.title,
				target: obj.value,
				targetDate: obj.date,
				targetTimestampDate: new Date(obj.date).getTime(),
				addedTimestamp: Date.now(),
				type: 'progress',
				completed: false,
				status: '',
			})
			this.router.push('/goals')
		},

		async saveTargetGoal(obj, date, time) {
			await addDoc(collection(db, 'runningNotes', storeAuth.user.id, 'goals'), {
				title: obj.title,
				target: obj.target,
				targetDate: date,
				targetTimestampDate: new Date(date).getTime(),
				addedTimestamp: Date.now(),
				type: 'target',
				completed: false,
				hours: time.hours,
				minutes: time.minutes,
				seconds: time.seconds,
				status: '',
			})
			this.router.push('/goals')
		},

		async deleteGoal(id) {
			await deleteDoc(doc(db, 'runningNotes', storeAuth.user.id, 'goals', id))
		},

		async editGoal(id, details) {
			const docRef = doc(db, 'runningNotes', storeAuth.user.id, 'goals', id)
			await updateDoc(docRef, {
				title: details.title,
				target: details.target,
				targetDate: details.date,
			})
		},

		async completeGoal(id, status) {
			const docRef = doc(db, 'runningNotes', storeAuth.user.id, 'goals', id)
			await updateDoc(docRef, {
				completed: true,
				status: status,
			})
		},

		removeAllGoals() {
			this.goalsId.forEach(el => {
				deleteDoc(doc(db, 'runningNotes', storeAuth.user.id, 'goals', el))
			})
		},

		clearGoalSnapshot() {
			if (goalsSnapshot) goalsSnapshot()
		},
	},
})

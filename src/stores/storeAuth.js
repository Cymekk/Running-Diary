import { defineStore } from 'pinia'
import { auth, db } from '../firebase/index'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	updateProfile,
	getAuth,
	signOut,
	sendPasswordResetEmail,
	deleteUser,
	updatePassword,
} from 'firebase/auth'
import { doc, collection, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, deleteObject, listAll } from 'firebase/storage'
import { useStoreNotes } from './storeNotes'
import { useStoreGoals } from './storeGoals'

let storeNotes
let storeGoals

export const useStoreAuth = defineStore('storeAuth', {
	state: () => {
		return {
			user: {},
			loaded: false,
			isTestAccount: false,
			appVisited: false,
		}
	},

	actions: {
		init() {
			storeNotes = useStoreNotes()
			storeGoals = useStoreGoals()
			onAuthStateChanged(auth, user => {
				if (user) {
					this.user.id = user.uid
					this.user.photo = user.photoURL
					this.user.email = user.email
					if (user.uid === 'WY4FY8AHpIdm69UfcbylBtdVnp72') {
						this.isTestAccount = true
					}
					this.getNameAndSurname()
					this.loaded = true
					this.appVisited = true
					this.router.push('/')
					storeNotes.init()
					storeGoals.init()
				} else {
					this.user = {}
					storeGoals.clearGoalSnapshot()
					storeNotes.clearNotesSnapshot()
					this.router.push('/login')
					this.loaded = false
					this.isTestAccount = false
					this.appVisited = false
				}
			})
		},

		registerUser(credentials) {
			const auth = getAuth()
			createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
				.then(user => {
					updateProfile(auth.currentUser, {
						displayName: `${credentials.name} ${credentials.surname}`,
					})
					this.addNameAndSurname(credentials)
				})
				.catch(err => alert(err))
		},

		login(credentials) {
			signInWithEmailAndPassword(auth, credentials.email, credentials.password)
				.then(userCredentials => {})
				.catch(err => {
					alert(err.message)
				})
		},

		logoutUser() {
			signOut(auth)
				.then(() => {
					this.router.push('/login')
				})
				.catch(error => {
					console.log(error.message)
				})
		},

		resetPassword(mail) {
			sendPasswordResetEmail(auth, mail.mail)
				.then(() => {})
				.catch(err => {
					alert(err)
				})
		},

		async addNameAndSurname(credentials) {
			await setDoc(doc(db, 'users', this.user.id), {
				name: credentials.name,
				surname: credentials.surname,
				appVisited: false,
			})
		},

		async updateProfileDetails(profileDetails) {
			const docRef = doc(db, 'users', this.user.id)

			await updateDoc(docRef, {
				name: profileDetails.name,
				surname: profileDetails.surname,
				weight: profileDetails.weight,
			})
			this.getNameAndSurname()
		},

		async updateUserWeight(weight) {
			const docRef = doc(db, 'users', this.user.id)
			await updateDoc(docRef, {
				weight: weight,
			})
			this.getNameAndSurname
			location.reload()
		},

		async getNameAndSurname() {
			const docRef = doc(db, 'users', this.user.id)
			const docSnap = await getDoc(docRef)
			if (docSnap.exists()) {
				this.user.name = docSnap.data().name
				this.user.surname = docSnap.data().surname
				if (docSnap.data().weight) {
					this.user.weight = docSnap.data().weight
				} else {
					this.user.weight = ''
				}
			} else {
				return
			}
		},

		deleteProfilePicture() {
			const storage = getStorage()
			const pictureDir = ref(storage, `pictures/${this.user.id}`)
			let picturesArr = []

			listAll(pictureDir)
				.then(res => {
					res.items.forEach(itemRef => {
						picturesArr.push(itemRef.fullPath.split('/')[itemRef.fullPath.split('/').length - 1])
					})
					if (picturesArr.length !== 0) this.removeAllFiles(picturesArr)
				})
				.catch(err => {
					console.log(err)
				})
		},

		removeAllFiles(arr) {
			const storage = getStorage()
			arr.forEach(el => {
				const pictureRef = ref(storage, `pictures/${this.user.id}/${el}`)
				deleteObject(pictureRef)
					.then(() => {})
					.catch(err => {
						console.log(err)
					})
			})
			const url = ''
			this.updateProfileImage(url)
		},

		deleteUser() {
			const id = this.user.id
			deleteUser(auth.currentUser)
				.then(() => {
					this.removeUserData(id)
				})
				.catch(error => alert(error))
		},

		async removeUserData(id) {
			await deleteDoc(doc(db, 'users', id))
		},

		updateProfileImage(url) {
			const auth = getAuth()
			updateProfile(auth.currentUser, {
				photoURL: url,
			})
				.then(() => {
					const docRef = doc(db, 'users', this.user.id)

					updateDoc(docRef, {
						photo: url,
					})
				})
				.catch(error => {
					alert(error)
				})
		},

		changeProfileImg() {
			const auth = getAuth()
			this.user.photo = auth.currentUser.photoURL
		},

		updateUserPassword(pwd) {
			const auth = getAuth()
			const user = auth.currentUser

			updatePassword(user, pwd)
				.then(() => {
					console.log('password has been changed')
				})
				.catch(error => {
					alert(error.message)
				})
		},

		removeAccount() {
			storeGoals.removeAllGoals()
			storeNotes.removeAllNotes()
			this.deleteProfilePicture()
			this.deleteUser()
			this.router.push('/login')
		},

		changeAppVisited() {
			this.appVisited = false
		},

		removeTestAccountWeight() {
			const docRef = doc(db, 'users', this.user.id)
			updateDoc(docRef, {
				weight: '',
			})
		},

		resetTestData() {
			console.log('resetting test data')
			this.removeTestAccountWeight('')
			this.getNameAndSurname()
			storeNotes.removeAllNotes()
			storeGoals.removeAllGoals()
			this.appVisited = false
		},
	},

	getters: {},
})

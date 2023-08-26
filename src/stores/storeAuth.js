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


export const useStoreAuth = defineStore('storeAuth', {
	state: () => {
		return {
			user: {},
			loaded: false,
		}
	},

	actions: {
		init() {
			onAuthStateChanged(auth, user => {
				if (user) {
					this.user.id = user.uid
					this.user.photo = user.photoURL
					this.user.email = user.email
					this.getNameAndSurname()
					this.loaded = true
					this.router.push('/')
				} else {
					this.user = {}
					this.loaded = false
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
			})
		},

		async updateProfileDetails(profileDetails) {
			const docRef = doc(db, 'users', this.user.id)

			await updateDoc(docRef, {
				name: profileDetails.name,
				surname: profileDetails.surname,
				weight: profileDetails.weight,
			})
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

		deleteUser() {
			const id = this.user.id
			deleteUser(auth.currentUser)
				.then(() => {
					this.router.push('/login')
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
	},

	getters: {},
})

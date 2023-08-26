import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyC2VT4XPjQhDeI9T-cJb0TgNj5D-RexfI8',
	authDomain: 'running-diary-38ae0.firebaseapp.com',
	projectId: 'running-diary-38ae0',
	storageBucket: 'running-diary-38ae0.appspot.com',
	messagingSenderId: '999567235980',
	appId: '1:999567235980:web:059104678e853831df14a9',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { db, auth, storage }

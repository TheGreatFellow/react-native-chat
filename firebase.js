import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyBKKYaWpoavb-uJNP0XGa3Vpzy6Lmh5X3w',
    authDomain: 'schmooze1.firebaseapp.com',
    projectId: 'schmooze1',
    storageBucket: 'schmooze1.appspot.com',
    messagingSenderId: '252108027894',
    appId: '1:252108027894:web:497b224054620984e7b9d7',
}

let app
// if (getApps().length === 0) {
app = initializeApp(firebaseConfig)
// } else {
// app = getApp()
// }

const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }

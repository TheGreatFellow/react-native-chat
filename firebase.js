import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: ENV.apiKey,
    authDomain: 'schmooze1.firebaseapp.com',
    projectId: 'schmooze1',
    storageBucket: 'schmooze1.appspot.com',
    messagingSenderId: '252108027894',
    appId: 'ENV.appID',
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

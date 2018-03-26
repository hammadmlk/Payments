import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyDBSVyAnre4bfmgYaJtZQ6ITr0OhcvF-yo',
  authDomain: 'payments-1bda2.firebaseapp.com',
  databaseURL: 'https://payments-1bda2.firebaseio.com',
  projectId: 'payments-1bda2',
  storageBucket: 'payments-1bda2.appspot.com',
  messagingSenderId: '400162303088',
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth

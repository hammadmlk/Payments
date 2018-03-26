import firebase from 'firebase'
import { firebaseAuth } from 'config/constants'

export default function auth (email, password) {
  return firebaseAuth().signInWithEmailAndPassword(email, password)
}

export function checkIfAuthed (store) {
  return firebaseAuth().currentUser ? true : false
  // return store.getState().authentication.get('isAuthed') === true
}

export function logout () {
  return firebaseAuth().signOut()
}

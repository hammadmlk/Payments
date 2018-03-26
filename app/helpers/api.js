import { ref } from 'config/constants'

function createPerson (person) {
  const personId = ref.child('people').push().key
  const personPromise = ref.child(`people/${personId}`).set({...person, personId})
  return {
    personId,
    personPromise,
  }
}

function createProject (project) {
  const projectId = ref.child('projects').push().key
  const projectPromise = ref.child(`projects/${projectId}`).set({...project, projectId})
  return {
    projectId,
    projectPromise,
  }
}

function createTransaction (projectId, transaction) {
  const transactionId = ref.child(`transactions/${projectId}`).push().key
  const transactionPromise = ref.child(`transactions/${projectId}/${transactionId}`).set({...transaction, transactionId, projectId})
  return {
    transactionId,
    transactionPromise,
  }
}

export function saveProject (project) {
  const {projectId, projectPromise} = createProject(project)
  return projectPromise.then(() => ({...project, projectId}))
}

export function fetchProjects () {
  return ref.child('projects').once('value')
    .then((snapshot) => snapshot.val() || {})
}

export function savePerson (person) {
  const {personId, personPromise} = createPerson(person)
  return personPromise.then(() => ({...person, personId}))
}

export function fetchPeople () {
  return ref.child('people').once('value')
    .then((snapshot) => snapshot.val() || {})
}

export function saveTransaction (projectId, transaction) {
  const {transactionId, transactionPromise} = createTransaction(projectId, transaction)
  return transactionPromise.then(() => ({...transaction, projectId, transactionId}))
}

export function fetchTransactions (projectId) {
  return ref.child(`transactions/${projectId}`).once('value')
    .then((snapshot) => snapshot.val() || {})
}

/*

export function saveDuck (duck) {
  const { duckId, duckPromise } = saveToDucks(duck)

  return Promise.all([
    duckPromise,
    saveToUsersDucks(duck, duckId),
    saveLikeCount(duckId),
  ]).then(() => ({...duck, duckId}))
}

export function listenToFeed (cb, errorCB) {
  ref.child('ducks').on('value', (snapshot) => {
    const feed = snapshot.val() || {}
    const sortedIds = Object.keys(feed).sort((a, b) => feed[b].timestamp - feed[a].timestamp)
    cb({feed, sortedIds})
  }, errorCB)
}
*/

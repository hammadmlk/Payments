import { savePerson, fetchPeople } from 'helpers/api'
import { Map, fromJS } from 'immutable'

const FETCHING_PEOPLE = 'FETCHING_PEOPLE'
const FETCHING_PEOPLE_ERROR = 'FETCHING_PEOPLE_ERROR'
const FETCHING_PEOPLE_SUCCESS = 'FETCHING_PEOPLE_SUCCESS'
const ADDING_PERSON = 'ADDING_PERSON'
const ADDING_PERSON_ERROR = 'ADDING_PERSON_ERROR'
const ADDING_PERSON_SUCCESS = 'ADDING_PERSON_SUCCESS'

// Action Creators

function fetchingPeople () {
  return {
    type: FETCHING_PEOPLE,
  }
}

function fetchingPeopleError (error) {
  console.error(error)
  return {
    type: FETCHING_PEOPLE_ERROR,
    error: 'Error fetching people',
  }
}

function fetchingPeopleSuccess (people) {
  return {
    type: FETCHING_PEOPLE_SUCCESS,
    people,
  }
}

function addingPerson () {
  return {
    type: ADDING_PERSON,
  }
}

function addingPersonError (error) {
  console.log(error)
  return {
    type: ADDING_PERSON_ERROR,
    error: 'Error adding person',
  }
}

function addingPersonSuccess (person) {
  return {
    type: ADDING_PERSON_SUCCESS,
    person,
  }
}

// Thunks

export function fetchAndHandlePeople () {
  return function (dispatch) {
    dispatch(fetchingPeople())
    fetchPeople()
      .then((people) => dispatch(fetchingPeopleSuccess(people)))
      .catch((error) => dispatch(fetchingPeopleError(error)))
  }
}

export function addAndHandlePerson (person) {
  return function (dispatch) {
    dispatch(addingPerson())
    savePerson(person)
      .then((person) => dispatch(addingPersonSuccess(person)))
      .catch((error) => dispatch(addingPersonError(error)))
  }
}

// Reducer

const initialState = Map({
  isFetching: true,
  fetchingError: '',
  isAdding: false,
  addingError: '',
  people: Map({}),
})

export default function peopleReducer (state = initialState, action) {
  switch (action.type) {
    case FETCHING_PEOPLE :
      return state.merge({
        isFetching: true,
      })
    case FETCHING_PEOPLE_ERROR :
      return state.merge({
        isFetching: false,
        fetchingError: action.error,
      })
    case FETCHING_PEOPLE_SUCCESS :
      return state.merge({
        isFetching: false,
        fetchingError: '',
        people: Map(action.people),
      })
    case ADDING_PERSON :
      return state.merge({
        isAdding: true,
      })
    case ADDING_PERSON_ERROR :
      return state.merge({
        isAdding: false,
        addingError: action.error,
      })
    case ADDING_PERSON_SUCCESS :
      const stateWithPersonAdded =
              state.setIn(['people', action.person.personId], action.person)
      return stateWithPersonAdded.merge({
        isAdding: false,
        addingError: '',
      })
    default :
      return state
  }
}

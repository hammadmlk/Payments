import auth, { logout } from 'helpers/auth'
import { Map, fromJS } from 'immutable'

const FETCHING_AUTH = 'FETCHING_AUTH'
const FETCHING_AUTH_ERROR = 'FETCHING_AUTH_ERROR'
const FETCHING_AUTH_SUCCESS = 'FETCHING_AUTH_SUCCESS'
const UNAUTH = 'UNAUTH'

// Action Creators

function fetchingAuth () {
  return {
    type: FETCHING_AUTH,
  }
}

function fetchingAuthError () {
  return {
    type: FETCHING_AUTH_ERROR,
  }
}

function fetchingAuthSuccess (authUserId) {
  return {
    type: FETCHING_AUTH_SUCCESS,
    authUserId,
  }
}

function unauthUser () {
  return {
    type: UNAUTH,
  }
}

// Thunks

export function fetchAndHandleAuth (email, password) {
  return function (dispatch) {
    dispatch(fetchingAuth())
    return auth(email, password).then((user) => {
      return dispatch(fetchingAuthSuccess(user.uid))
    })
    .catch((error) => dispatch(fetchingAuthError(error)))
  }
}

export function logoutAndUnauth () {
  return function (dispatch) {
    logout()
    dispatch(unauthUser())
  }
}

// Reducer

const initialState = Map({
  isFetching: false,
  error: '',
  authUserId: '',
  isAuthed: false,
})

export default function authenticationReducer (state = initialState, action) {
  switch (action.type) {
    case FETCHING_AUTH :
      return state.merge({
        isFetching: true,
      })
    case FETCHING_AUTH_ERROR :
      return state.merge({
        isFetching: false,
        error: action.error,
      })
    case FETCHING_AUTH_SUCCESS :
      return state.merge({
        isFetching: false,
        error: '',
        authUserId: action.authUserId,
        isAuthed: true,
      })
    case UNAUTH:
      return state.merge({
        authUserId: '',
        isAuthed: false,
      })
    default :
      return state
  }
}


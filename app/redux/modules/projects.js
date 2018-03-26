import { saveProject, fetchProjects } from 'helpers/api'
import { Map, fromJS } from 'immutable'

const FETCHING_PROJECTS = 'FETCHING_PROJECTS'
const FETCHING_PROJECTS_ERROR = 'FETCHING_PROJECTS_ERROR'
const FETCHING_PROJECTS_SUCCESS = 'FETCHING_PROJECTS_SUCCESS'
const ADDING_PROJECT = 'ADDING_PROJECT'
const ADDING_PROJECT_ERROR = 'ADDING_PROJECT_ERROR'
const ADDING_PROJECT_SUCCESS = 'ADDING_PROJECT_SUCCESS'

// Action Creators

function fetchingProjects () {
  return {
    type: FETCHING_PROJECTS,
  }
}

function fetchingProjectsError (error) {
  console.error(error)
  return {
    type: FETCHING_PROJECTS_ERROR,
    error: 'Error fetching projects',
  }
}

function fetchingProjectsSuccess (projects) {
  return {
    type: FETCHING_PROJECTS_SUCCESS,
    projects,
  }
}

function addingProject () {
  return {
    type: ADDING_PROJECT,
  }
}

function addingProjectError (error) {
  console.log(error)
  return {
    type: ADDING_PROJECT_ERROR,
    error: 'Error adding project',
  }
}

function addingProjectSuccess (project) {
  return {
    type: ADDING_PROJECT_SUCCESS,
    project,
  }
}

// Thunks

export function fetchAndHandleProjects () {
  return function (dispatch) {
    dispatch(fetchingProjects())
    fetchProjects()
      .then((projects) => dispatch(fetchingProjectsSuccess(projects)))
      .catch((error) => dispatch(fetchingProjectsError(error)))
  }
}

export function addAndHandleProject (project) {
  return function (dispatch) {
    dispatch(addingProject())
    saveProject(project)
      .then((project) => dispatch(addingProjectSuccess(project)))
      .catch((error) => dispatch(addingProjectError(error)))
  }
}

// Reducer

const initialState = Map({
  isFetching: true,
  fetchingError: '',
  isAdding: false,
  addingError: '',
  projects: Map({}),
})

export default function projectsReducer (state = initialState, action) {
  switch (action.type) {
    case FETCHING_PROJECTS :
      return state.merge({
        isFetching: true,
      })
    case FETCHING_PROJECTS_ERROR :
      return state.merge({
        isFetching: false,
        fetchingError: action.error,
      })
    case FETCHING_PROJECTS_SUCCESS :
      return state.merge({
        isFetching: false,
        fetchingError: '',
        projects: Map(action.projects),
      })
    case ADDING_PROJECT :
      return state.merge({
        isAdding: true,
      })
    case ADDING_PROJECT_ERROR :
      return state.merge({
        isAdding: false,
        addingError: action.error,
      })
    case ADDING_PROJECT_SUCCESS :
      const stateWithPersonAdded = state.setIn(['projects', action.project.projectId], action.project)
      return stateWithPersonAdded.merge({
        isAdding: false,
        addingError: '',
      })
    default :
      return state
  }
}

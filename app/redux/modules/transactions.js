import { saveTransaction, fetchTransactions } from 'helpers/api'
import { Map, fromJS } from 'immutable'

const FETCHING_TRANSACTIONS = 'FETCHING_TRANSACTIONS'
const FETCHING_TRANSACTIONS_ERROR = 'FETCHING_TRANSACTIONS_ERROR'
const FETCHING_TRANSACTIONS_SUCCESS = 'FETCHING_TRANSACTIONS_SUCCESS'
const ADDING_TRANSACTION = 'ADDING_TRANSACTION'
const ADDING_TRANSACTION_ERROR = 'ADDING_TRANSACTION_ERROR'
const ADDING_TRANSACTION_SUCCESS = 'ADDING_TRANSACTION_SUCCESS'

// Action Creators

function fetchingTransactions (projectId) {
  return {
    type: FETCHING_TRANSACTIONS,
    projectId,
  }
}

function fetchingTransactionsError (projectId, error) {
  console.error(error)
  return {
    type: FETCHING_TRANSACTIONS_ERROR,
    projectId,
    error: 'Error fetching transactions',
  }
}

function fetchingTransactionsSuccess (projectId, transactions) {
  return {
    type: FETCHING_TRANSACTIONS_SUCCESS,
    projectId,
    transactions,
  }
}

function addingTransaction (projectId) {
  return {
    type: ADDING_TRANSACTION,
    projectId,
  }
}

function addingTransactionError (projectId, error) {
  console.log(error)
  return {
    type: ADDING_TRANSACTION_ERROR,
    projectId,
    error: 'Error adding transaction',
  }
}

function addingTransactionSuccess (projectId, transaction) {
  return {
    type: ADDING_TRANSACTION_SUCCESS,
    projectId,
    transaction,
  }
}

// Thunks

export function fetchAndHandleTransactions (projectId) {
  return function (dispatch) {
    dispatch(fetchingTransactions(projectId))
    fetchTransactions(projectId)
      .then((transactions) => dispatch(fetchingTransactionsSuccess(projectId, transactions)))
      .catch((error) => dispatch(fetchingTransactionsError(projectId, error)))
  }
}

export function addAndHandleTransaction (projectId, transaction) {
  return function (dispatch) {
    dispatch(addingTransaction(projectId))
    saveTransaction(projectId, transaction)
      .then((transaction) => dispatch(addingTransactionSuccess(projectId, transaction)))
      .catch((error) => dispatch(addingTransactionError(projectId, error)))
  }
}

// Reducer

const initialState = Map({
  isFetching: true,
  fetchingError: '',
  isAdding: false,
  addingError: '',
  transactions: Map({}),
})

export default function allTransactionsReducer (state = initialState, action) {
  switch (action.type) {
    case FETCHING_TRANSACTIONS :
      return state.merge({
        isFetching: true,
      })
    case FETCHING_TRANSACTIONS_ERROR :
      return state.merge({
        isFetching: false,
        fetchingError: action.error,
      })
    case FETCHING_TRANSACTIONS_SUCCESS :
      return state.merge({
        isFetching: false,
        fetchingError: '',
        transactions: state.get('transactions').set(action.projectId, Map(action.transactions)),
      })
    case ADDING_TRANSACTION :
      return state.merge({
        isAdding: true,
      })
    case ADDING_TRANSACTION_ERROR :
      return state.merge({
        isAdding: false,
        addingError: action.error,
      })
    case ADDING_TRANSACTION_SUCCESS :
      const stateWithNewTransaction =
              state.setIn(['transactions', action.projectId, action.transaction.transactionId], action.transaction)

      return stateWithNewTransaction.merge({
        isAdding: false,
        addingError: '',
      })
    default :
      return state
  }
}

import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import {
  MainContainer,
  HomeContainer,
  AuthenticateContainer,
  LogoutContainer,
  AddTransactionContainer,
  TransactionsContainer,
  ProjectsContainer,
  PeopleContainer,
} from 'containers'

export default function getRoutes (checkAuth, history) {
  return (
    <Router history={history}>
      <Route path='/' component={MainContainer}>
        <IndexRoute component={HomeContainer} onEnter={checkAuth}/>

        <Route path='auth' component={AuthenticateContainer} />
        <Route path='logout' component={LogoutContainer} />

        <Route path='addTransaction' component={AddTransactionContainer} onEnter={checkAuth} />
        <Route path='transactions' component={TransactionsContainer} onEnter={checkAuth} />
        <Route path='projects' component={ProjectsContainer} onEnter={checkAuth} />
        <Route path='people' component={PeopleContainer} onEnter={checkAuth} />

      </Route>
    </Router>
  )
}

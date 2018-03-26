import React, { PropTypes } from 'react'
import { Authenticate } from 'components'
import auth from 'helpers/auth'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as authenticationActions from 'redux/modules/authentication'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

const AuthenticateContainer = React.createClass({
  propTypes: {
    fetchAndHandleAuth: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState () {
    return {
      email: '',
      password: '',
    }
  },
  handleLogin () {
    this.props.fetchAndHandleAuth(this.state.email, this.state.password)
      .then(() => this.context.router.replace('addTransaction'))
  },
  render () {
    return (
      <div>
        <TextField
          floatingLabelText='email'
          fullWidth={true}
          value={this.state.email}
          onChange={(e, value) => { this.setState({email: value}) }}/>

        <TextField
          floatingLabelText='password'
          fullWidth={true}
          type={'password'}
          value={this.state.password}
          onChange={(e, value) => { this.setState({password: value}) }}/>

        <RaisedButton
          label='Login'
          fullWidth={true}
          primary={true}
          disabled={this.props.isFetching}
          onClick={this.handleLogin}/>

          {this.props.error ? <p>Ops! Somehting went wrong: {error}</p> : null}

      </div>
    )
  },
})

export default connect(
  ({authentication}) => ({
    isFetching: authentication.get('isFetching'),
    error: authentication.get('error'),
  }),
  (dispatch) => bindActionCreators({
    ...authenticationActions,
  }, dispatch)
)(AuthenticateContainer)

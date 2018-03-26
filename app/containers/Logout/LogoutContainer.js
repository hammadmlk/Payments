import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { logoutAndUnauth } from 'redux/modules/authentication'
import { Logout } from 'components'

const LogoutContainer = React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
  },
  componentDidMount () {
    this.props.dispatch(logoutAndUnauth())
  },
  render () {
    return <span>Logging you out... any moment now :)</span>
  },
})

export default connect()(LogoutContainer)

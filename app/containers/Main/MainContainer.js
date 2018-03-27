import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { firebaseAuth } from 'config/constants'
import * as styles from 'sharedStyles/styles.css'

import * as peopleActions from 'redux/modules/people'
import * as projectActions from 'redux/modules/projects'

import { TransactionAddContainer } from 'containers'
import { Navigation } from 'components'

import FontIcon from 'material-ui/FontIcon'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'

const addTransactionIcon = <FontIcon className='material-icons'>note_add</FontIcon>
const transactionsIcon = <FontIcon className='material-icons'>list</FontIcon>
const projectsIcon = <FontIcon className='material-icons'>assignment</FontIcon>
const peopleIcon = <FontIcon className='material-icons'>people</FontIcon>

const MainContainer = React.createClass({
  propTypes: {
    fetchAndHandlePeople: PropTypes.func.isRequired,
    fetchAndHandleProjects: PropTypes.func.isRequired,
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  componentDidMount () {
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.props.fetchAndHandlePeople()
        this.props.fetchAndHandleProjects()
        this.context.router.replace('/')
      } else {
        this.context.router.replace('auth')
      }
    })
  },
  getNavSelectedIndex () {
    const path = this.props.location.pathname.toLowerCase()
    switch (path) {
      case '/addtransaction':
        return 0
      case '/transactions':
        return 1
      case '/projects':
        return 2
      case '/people':
        return 3
      default:
        return -1
    }
  },
  render () {
    return (
      <div style={{minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div>
          {this.props.children}
          <br/>
          <br/>
          <br/>
        </div>
        <nav>
          <Paper zDepth={3} style={{zIndex: 3, position: 'fixed', bottom: 0, left: 0, right: 0}}>
            <BottomNavigation selectedIndex={this.getNavSelectedIndex()} >
              <BottomNavigationItem
                label='add'
                icon={addTransactionIcon}
                onClick={() => (this.context.router.replace('addTransaction'))}/>
              <BottomNavigationItem
                label='logs'
                icon={transactionsIcon}
                onClick={() => (this.context.router.replace('transactions'))}/>
              <BottomNavigationItem
                label='projects'
                icon={projectsIcon}
                onClick={() => (this.context.router.replace('projects'))}/>
              <BottomNavigationItem
                label='people'
                icon={peopleIcon}
                onClick={() => (this.context.router.replace('people'))}/>
            </BottomNavigation>
          </Paper>
        </nav>

      </div>
    )
  },
})

export default connect(
  () => ({}),
  (dispatch) => bindActionCreators({
    ...peopleActions,
    ...projectActions,
  }, dispatch)
)(MainContainer)

import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {formatPerson} from 'helpers/utils'

import * as peopleActions from 'redux/modules/people'
import * as transactionActions from 'redux/modules/transactions'

import {cyan500} from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Card, CardActions, CardHeader, CardText, CardTitle} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import FontIcon from 'material-ui/FontIcon'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'

const filterIcon = <FontIcon className='material-icons'>filter_list</FontIcon>

const TransactionsContainer = React.createClass({
  propTypes: {
    fetchAndHandleTransactions: PropTypes.func.isRequired,
    people: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    transactions: PropTypes.object.isRequired,
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState: function () {
    return {
      selectedProjectId: '',
    }
  },
  componentDidMount () {
  },
  handleProjectSelection (e, key, value) {
    this.props.fetchAndHandleTransactions(value)
    this.setState({
      selectedProjectId: value,
    })
  },
  render () {
    const projectsMenuItems = []
    this.props.projects.map((project) => {
      projectsMenuItems.push(<MenuItem value={project.projectId} key={project.projectId} primaryText={project.name} />)
    })

    const projectTransactions = []
    if (this.props.transactions.get(this.state.selectedProjectId)) {
      this.props.transactions.get(this.state.selectedProjectId).map((transaction) => {
        projectTransactions.push(transaction)
      })
    }

    const projectTransactionListItems = projectTransactions.map((transaction) => {
      const recievedByName = this.props.people.get(transaction.recievedByPersonId).name || 'unknown'
      const paidByName = this.props.people.get(transaction.paidByPersonId).name || 'unknown'

      return <TransactionListItem
        isOutbound={transaction.isOutbound}
        amount={transaction.amount}
        title={transaction.title}
        recievedByName={recievedByName}
        paidByName={paidByName}
        comments={transaction.comments}
        timestamp={transaction.timestamp}
        key={transaction.transactionId}/>
    })

    const emptyListItem = []
    if (!projectTransactionListItems.length && this.state.selectedProjectId) {
      emptyListItem.push(
        <ListItem
          key={0}
          secondaryText='There are no transactions for the selected project'/>
      )
    }

    return (
      <Paper zDepth={1} style={{maxWidth: '330em', margin: '0.5em'}}>
        <Toolbar>
          <ToolbarGroup >
            <SelectField
              hintText='Choose a project'
              value={this.state.selectedProjectId}
              onChange={this.handleProjectSelection}>
              {projectsMenuItems}
            </SelectField>
          </ToolbarGroup>
        </Toolbar>

        <List>
          {projectTransactionListItems}
          {emptyListItem}
        </List>
      </Paper>
    )
  },
})

function TransactionListItem ({isOutbound, amount, title, recievedByName, paidByName, comments, timestamp}) {
  return (
    <ListItem
      rightAvatar={<strong style={{color: cyan500}}> RS {amount}</strong>}
      primaryText={title}
      secondaryText={<p><strong>{paidByName}</strong> --> <strong>{recievedByName}</strong> -- {comments || 'no comments'}</p>}
      secondaryTextLines={2}/>
  )
}

export default connect(
  ({people, projects, transactions}) => {
    return {
      people: people.get('people'),
      projects: projects.get('projects'),
      transactions: transactions.get('transactions'),

      isFetching: people.get('isFetching'),
      fetchingError: people.get('fetchingError'),
    }
  },
  (dispatch) => bindActionCreators({
    ...transactionActions,
  }, dispatch)
)(TransactionsContainer)

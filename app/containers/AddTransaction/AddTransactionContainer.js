import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {formatTransaction} from 'helpers/utils'

import * as transactionActions from 'redux/modules/transactions'
import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import Toggle from 'material-ui/Toggle'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Paper from 'material-ui/Paper'

const AddTransactionContainer = React.createClass({
  propTypes: {
    addAndHandleTransaction: PropTypes.func.isRequired,
    people: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState: function () {
    return {
      projectId: undefined,
      amount: undefined,
      title: '',
      teamPersonId: undefined,
      clientPersonId: undefined,
      comments: '',
      dialogOpen: false,
    }
  },
  componentDidMount () {

  },
  handleDialogClose () {
    this.setState({
      dialogOpen: false,
    })
  },
  handlePaid () {
    this.addTransaction(true)
  },
  handleReceived () {
    this.addTransaction(false)
  },
  addTransaction (isOutbound) {
    this.props.addAndHandleTransaction(
      this.state.projectId,
      formatTransaction(
        isOutbound,
        this.state.amount,
        this.state.title,
        this.state.teamPersonId,
        this.state.clientPersonId,
        this.state.comments
      )
    )
    this.setState({
      amount: 0,
      title: '',
      comments: '',
      dialogOpen: true,
    })
  },
  isSaveButtonDisabled () {
    return this.state.projectId == undefined ||
           this.state.amount == undefined ||
           this.state.title == '' ||
           this.state.teamPersonId == undefined ||
           this.state.clientPersonId == undefined
  },
  render () {
    const teamMenuItems = []
    this.props.people
      .filter((person) => (person.role == 'team'))
      .map((person) => {
        teamMenuItems.push(<MenuItem value={person.personId} key={person.personId} primaryText={person.name} />)
      })

    const clientMenuItems = []
    this.props.people
      .filter((person) => (person.role == 'client'))
      .map((person) => {
        clientMenuItems.push(<MenuItem value={person.personId} key={person.personId} primaryText={person.name} />)
      })

    const projectsMenuItems = []
    this.props.projects.map((project) => {
      projectsMenuItems.push(<MenuItem value={project.projectId} key={project.projectId} primaryText={project.name} />)
    })

    return (
      <Paper zDepth={1} style={{maxWidth: '30em', padding: '1em', margin: '1em'}}>

        <h3> Log transaction </h3>

        <SelectField
          hintText='Which project is this payment related to?'
          floatingLabelText='Project'
          fullWidth={true}
          value={this.state.projectId}
          onChange={(e, key, value) => { this.setState({projectId: value}) }}>
          {projectsMenuItems}
        </SelectField>

        <TextField
          hintText='What was this payment for?'
          floatingLabelText='For'
          fullWidth={true}
          value={this.state.title}
          onChange={(e, value) => { this.setState({title: value}) }}/>

        <TextField
          hintText='The amount in PRK'
          floatingLabelText='Amount'
          type='number'
          fullWidth={true}
          value={this.state.amount}
          onChange={(e, value) => { this.setState({amount: value}) }}/>

        <SelectField
          style={{width: '45%', float: 'left'}}
          hintText='Which teammate was involved in this transaction?'
          floatingLabelText='Teammate'
          value={this.state.teamPersonId}
          onChange={(e, key, value) => { this.setState({teamPersonId: value}) }}>
          {teamMenuItems}
        </SelectField>

        <SelectField
          style={{width: '45%', float: 'right'}}
          hintText='Which client was involved in this transaction?'
          floatingLabelText='Client'
          value={this.state.clientPersonId}
          onChange={(e, key, value) => { this.setState({clientPersonId: value}) }}>
          {clientMenuItems}
        </SelectField>

        <TextField
          hintText='Any notes you want to log?'
          floatingLabelText='Comments'
          fullWidth={true}
          multiLine={true}
          rowsMax={4}
          value={this.state.comments}
          onChange={(e, value) => { this.setState({comments: value}) }}/>

        <RaisedButton
          style={{width: '50%', paddingRight: '0.5em'}}
          label='Paid'
          primary={true}
          disabled={this.isSaveButtonDisabled()}
          onClick={this.handlePaid}/>

        <RaisedButton
          style={{width: '50%', paddingLeft: '0.5em'}}
          label='Received'
          primary={true}
          disabled={this.isSaveButtonDisabled()}
          onClick={this.handleReceived}/>

        <br />

        <Dialog
          actions={<FlatButton label='Okay' primary={true} onClick={this.handleDialogClose}/>}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleDialogClose}>
          Transaction Saved. You can now see it in logs.
        </Dialog>

      </Paper>
    )
  },
})

export default connect(
  ({people, projects}) => ({
    people: people.get('people'),
    projects: projects.get('projects'),
  }),
  (dispatch) => bindActionCreators({
    ...transactionActions,
  }, dispatch)
)(AddTransactionContainer)

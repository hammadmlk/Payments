import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {formatPerson} from 'helpers/utils'

import * as peopleActions from 'redux/modules/people'

import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Card, CardActions, CardHeader, CardText, CardTitle} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'

const PeopleContainer = React.createClass({
  propTypes: {
    fetchAndHandlePeople: PropTypes.func.isRequired,
    addAndHandlePerson: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    fetchingError: PropTypes.string.isRequired,
    isAdding: PropTypes.bool.isRequired,
    addingError: PropTypes.string.isRequired,
    people: PropTypes.object.isRequired,
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState: function () {
    return {
      newPersonName: '',
    }
  },
  componentDidMount () {
    this.props.fetchAndHandlePeople()
  },
  isAddPersonDisabled () {
    return this.state.newPersonName == '' ||
           this.props.isFetching ||
           this.props.isAdding
  },
  handleAddTeammate () {
    this.addPerson('team')
  },
  handleAddClient () {
    this.addPerson('client')
  },
  addPerson (role) {
    this.props.addAndHandlePerson(
      formatPerson(
        this.state.newPersonName,
        role
      )
    )
    this.setState({newPersonName: ''})
  },
  render () {
    const peopleList = []
    this.props.people
      .map((person) => {
        peopleList.push(
          <TableRow key={person.personId} >
            <TableRowColumn>{person.name}</TableRowColumn>
            <TableRowColumn>{person.role}</TableRowColumn>
          </TableRow>
        )
      })

    return (
      <div>
        <br/>

        <Card style={{maxWidth: '30em', margin: '0.5em'}}>
          <CardText >
            <h4>Add a person</h4>
            <TextField
              hintText='Name of the person'
              fullWidth={true}
              value={this.state.newPersonName}
              onChange={(e, value) => { this.setState({newPersonName: value}) }}/>
          </CardText>

          <CardActions>
            <FlatButton
              label='Add client'
              primary={true}
              disabled={this.isAddPersonDisabled()}
              onClick={this.handleAddClient} />
            <FlatButton
              label='Add teammate'
              disabled={this.isAddPersonDisabled()}
              onClick={this.handleAddTeammate} />
          </CardActions>
        </Card>

        <br/>
        <br/>

        <Card style={{maxWidth: '30em', margin: '0.5em'}}>
          <CardText >
            <Table>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Role</TableHeaderColumn>
                </TableRow>
              </TableHeader>

              <TableBody stripedRows={true} displayRowCheckbox={false}>
                {peopleList}
              </TableBody>
            </Table>
          </CardText>
        </Card>

      </div>
    )
  },
})

export default connect(
  ({people}) => ({
    isFetching: people.get('isFetching'),
    fetchingError: people.get('fetchingError'),
    isAdding: people.get('isAdding'),
    addingError: people.get('addingError'),
    people: people.get('people'),
  }),
  (dispatch) => bindActionCreators({
    ...peopleActions,
  }, dispatch)
)(PeopleContainer)

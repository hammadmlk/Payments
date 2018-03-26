import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {formatProject} from 'helpers/utils'

import * as projectActions from 'redux/modules/projects'

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

const ProjectsContainer = React.createClass({
  propTypes: {
    fetchAndHandleProjects: PropTypes.func.isRequired,
    addAndHandleProject: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    fetchingError: PropTypes.string.isRequired,
    isAdding: PropTypes.bool.isRequired,
    addingError: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState: function () {
    return {
      newProjectName: '',
    }
  },
  componentDidMount () {
    this.props.fetchAndHandleProjects()
  },
  isAddProjectDisabled () {
    return this.state.newProjectName == '' ||
           this.props.isFetching ||
           this.props.isAdding
  },
  handleAddProject () {
    this.props.addAndHandleProject(
      formatProject(
        this.state.newProjectName,
        'active'
      )
    )
    this.setState({newProjectName: ''})
  },
  render () {
    const projectsList = []
    this.props.projects
      .map((project) => {
        projectsList.push(
          <TableRow key={project.projectId} >
            <TableRowColumn>{project.name}</TableRowColumn>
            <TableRowColumn>{project.status}</TableRowColumn>
          </TableRow>
        )
      })

    return (
      <div>
        <br/>

        <Card style={{maxWidth: '30em', margin: '0.5em'}}>
          <CardText >
            <h4 >Add a project</h4>

            <TextField
              hintText='Name of the project'
              fullWidth={true}
              value={this.state.newProjectName}
              onChange={(e, value) => { this.setState({newProjectName: value}) }}/>
          </CardText>

          <CardActions>
            <FlatButton
              label='Add project'
              primary={true}
              disabled={this.isAddProjectDisabled()}
              onClick={this.handleAddProject} />
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
                  <TableHeaderColumn>Status</TableHeaderColumn>
                </TableRow>
              </TableHeader>

              <TableBody stripedRows={true} displayRowCheckbox={false}>
                {projectsList}
              </TableBody>
            </Table>
          </CardText>
        </Card>

      </div>
    )
  },
})

export default connect(
  ({projects}) => ({
    isFetching: projects.get('isFetching'),
    fetchingError: projects.get('fetchingError'),
    isAdding: projects.get('isAdding'),
    addingError: projects.get('addingError'),
    projects: projects.get('projects'),
  }),
  (dispatch) => bindActionCreators({
    ...projectActions,
  }, dispatch)
)(ProjectsContainer)

import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { Grid, Divider, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { TaskContext } from "../../Context";
import ProjectSteps from './Steps';
import TaskUpdate from '../../containers/TaskUpdate';
import ProjectActivitySummary from './ProjectActivitySummary';

export default function ProjectProcesses({ data, refetch }){
  const classes = useStyles();
  const { setSelectedStep, handleStepCompletion } = useContext(TaskContext);

  return (
    <>
      <Grid container direction="column">
        <Grid item xs={12} className={classes.activitySummary}>
          <ProjectActivitySummary />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid item xs={12} className={classes.processSteps}>
        <Typography variant="subtitle1" className={classes.processesHeader} data-testid="processes-header">Process Steps</Typography>
        <ProjectSteps
          data={data}
          setSelectedStep={setSelectedStep}
          handleStepCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
        />
      </Grid>
    </>
  )
}

export function ProjectProcessesSplitView({ refetch }) {
  const { projectId, selectedStep, setSelectedStep, handleStepCompletion } = useContext(TaskContext);

  return (
    <TaskUpdate
      taskId={selectedStep?.id || projectId}
      handleTaskCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
      handleSplitScreenOpen={setSelectedStep}
    />
  )
}

const Step = {
  id: PropTypes.string,
  body: PropTypes.string,
  completed: PropTypes.bool,
  author: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  }),
  assignees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  ),
  subTasks: PropTypes.arrayOf(PropTypes.object),
  dueDate: PropTypes.string,
  formUserId: PropTypes.string
}
ProjectProcesses.defaultProps = {}

ProjectProcesses.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Step)).isRequired,
  refetch: PropTypes.func.isRequired
}

ProjectProcessesSplitView.propTypes = {
 refetch: PropTypes.func.isRequired
}

const useStyles = makeStyles(() => ({
  activitySummary: {
    marginBottom: '20px'
  },
  divider: {
    height: '0px'
  },
  processSteps: {
    marginTop: '20px'
  },
  processesHeader: {
    marginBottom: '16px',
    fontWeight: 200
  }
}));

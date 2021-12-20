import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { TaskContext } from '../../Context/';
import ProjectSteps from './Steps';
import TaskUpdate from '../../containers/TaskUpdate';

export default function ProjectProcesses({ data, refetch }){
  const { setSelectedStep, handleStepCompletion } = useContext(TaskContext);

  return (
    <>
      <br />
      <Typography variant="h6">Process Steps</Typography>
      <ProjectSteps
        data={data}
        setSelectedStep={setSelectedStep}
        handleStepCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
      />
    </>
  )
}

export function ProjectProcessesSplitView({ refetch }) {
  const { projectId, selectedStep, handleStepCompletion } = useContext(TaskContext);

  return (
    <TaskUpdate
      taskId={selectedStep?.id || projectId}
      handleTaskCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
    />
  )
}

ProjectProcesses.defaultProps = {}

ProjectProcesses.propTypes = {
  data: PropTypes.shape({
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
    dueDate: PropTypes.string
  }).isRequired
}
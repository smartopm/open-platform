import React, { useContext } from 'react'
import { Grid,Typography } from '@mui/material';
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { TaskContext } from "../../Context";
import ProjectSteps from './Steps';
import ProjectItem from './ProjectItem';
import TaskTitle from '../../Components/TaskTitle';

export default function ClientPilotViewItem({process, refetch}) {
    const taskId  = process?.id
    const history = useHistory()
    const { t } = useTranslation('task')
    const { handleStepCompletion } = useContext(TaskContext);

    function handleProjectStepClick() {
      return history.push(`/processes/drc/projects/${taskId}?tab=processes`)
    }

    return (
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <Typography variant="h6">
            <TaskTitle task={process} />
          </Typography>
        </Grid>
        <Grid item md={12} xs={12} data-testid="project-container">
          <Grid container spacing={6} data-testid="project-open-tasks">
            <Grid item md={6} xs={12}>
              <Typography variant="h6">{t('processes.your_tasks')}</Typography>
              <br />
              <div>
                <ProjectItem taskId={taskId} clientView />
              </div>
            </Grid>
            <Grid item md={6} xs={12} data-testid="project-step-information">
              <Typography variant="h6">{t('processes.process_steps')}</Typography>
              <br />
              <ProjectSteps
                data={process?.subTasks}
                handleProjectStepClick={handleProjectStepClick}
                handleStepCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
                clientView
              />
            </Grid>

          </Grid>

        </Grid>

        <Grid item md={12} xs={12} style={{ marginBottom: '2px'}}><Divider /></Grid>

      </Grid>
    )
  }

  const Task = {
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
      subTasks: PropTypes.arrayOf(PropTypes.object)
    };

  ClientPilotViewItem.propTypes = {
    process: PropTypes.shape(Task).isRequired,
    refetch: PropTypes.func.isRequired,
  }

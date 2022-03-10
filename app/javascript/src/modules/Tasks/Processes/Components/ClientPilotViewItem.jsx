/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { removeNewLines, sanitizeText } from '../../../../utils/helpers';
import { TaskContext } from '../../Context';
import ProjectSteps from './Steps';
import ProjectItem from './ProjectItem';

export default function ClientPilotViewItem({ project, refetch }) {
  const taskId = project?.id;
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation('task');
  const { handleStepCompletion } = useContext(TaskContext);

  function handleProjectStepClick(tab = 'processes') {
    return history.push(`/processes/drc/projects/${taskId}?tab=${tab}`);
  }

  return (
    <Grid container spacing={2}>
      <Grid item md={12} xs={12}>
        <Typography
          variant="h6"
          className={classes.projectTitle}
          onClick={() => handleProjectStepClick('overview')}
        >
          <p
            data-testid="task-title"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: sanitizeText(removeNewLines(project.body))
            }}
          />
        </Typography>
      </Grid>
      <Grid item md={12} xs={12} data-testid="project-container">
        <Grid container spacing={6} data-testid="project-open-tasks">
          <Grid item md={6} xs={12}>
            <Grid container>
              <Grid item md={12} xs={12}>
                <p>Activity Summary</p>
              </Grid>
              <Grid item md={12} xs={12}>
                  <Typography variant="subtitle1">{t('processes.your_tasks')}</Typography>
                  <br />
                  <div>
                    <ProjectItem taskId={taskId} clientView />
                  </div>
              </Grid>
            </Grid>
            {/* <Typography variant="subtitle1">{t('processes.your_tasks')}</Typography>
            <br />
            <div>
              <ProjectItem taskId={taskId} clientView />
            </div> */}
          </Grid>
          <Grid item md={6} xs={12} data-testid="project-step-information">
            <Typography variant="h6">{t('processes.process_steps')}</Typography>
            <br />
            <ProjectSteps
              data={project?.subTasks}
              handleProjectStepClick={handleProjectStepClick}
              handleStepCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
              clientView
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item md={12} xs={12} style={{ marginBottom: '2px' }}>
        <Divider />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  projectTitle: {
    cursor: 'pointer'
  }
}));

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
  project: PropTypes.shape(Task).isRequired,
  refetch: PropTypes.func.isRequired
};

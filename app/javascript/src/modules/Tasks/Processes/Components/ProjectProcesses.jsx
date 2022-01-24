import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { Grid, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { TaskContext } from "../../Context";
import ProjectSteps from './Steps';
import ProjectActivitySummary from './ProjectActivitySummary';

export default function ProjectProcesses({ data, refetch, handleProjectStepClick }){
  const classes = useStyles();
  const { setSelectedStep, handleStepCompletion } = useContext(TaskContext);
  const { t } = useTranslation('task');

  return (
    <>
      <Grid container direction="column">
        <Grid item xs={12} className={classes.activitySummary}>
          <ProjectActivitySummary />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid item xs={12} className={classes.processSteps}>
        <Typography
          variant="subtitle1"
          className={classes.processesHeader}
          data-testid="processes-header"
        >
          {t('processes.process_steps')}
        </Typography>
        <ProjectSteps
          data={data}
          setSelectedStep={setSelectedStep}
          handleProjectStepClick={handleProjectStepClick}
          handleStepCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
        />
      </Grid>
    </>
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
  refetch: PropTypes.func.isRequired,
  handleProjectStepClick: PropTypes.func.isRequired
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

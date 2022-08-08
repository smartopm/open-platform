import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TaskContext } from '../../Context';
import ProjectSteps from './Steps';

export default function ProjectOverviewSplitView({ data, refetch, handleProjectStepClick }) {
  const { t } = useTranslation('task');
  const matches = useMediaQuery('(max-width:600px)');
  const { setSelectedStep, handleStepCompletion, updateStatus } = useContext(TaskContext);

  return (
    <>
      <Grid container style={matches ? { marginLeft: '-20px' } : { marginLeft: 0 }}>
        <Grid item md={12} data-testid="requirements-section">
          <Typography variant="subtitle1" style={{fontWeight: 400}}>{t('processes.requirements')}</Typography>
          <Typography variant="caption">{t('processes.requirements_guideline')}</Typography>
          <Link to="/news/post/8">
            <Typography variant="caption">{t('processes.go_to_guideline')}</Typography>
          </Link>
        </Grid>
        <Grid item md={12} xs={12}>
          <br />
          <br />
          <br />
          <ProjectSteps
            data={data}
            setSelectedStep={setSelectedStep}
            handleProjectStepClick={handleProjectStepClick}
            updateStatus={updateStatus}
            handleStepCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
            redirect
          />
        </Grid>
      </Grid>
    </>
  );
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
};

ProjectOverviewSplitView.defaultProps = {
  data: []
}

ProjectOverviewSplitView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Step)),
  refetch: PropTypes.func.isRequired,
  handleProjectStepClick: PropTypes.func.isRequired
};

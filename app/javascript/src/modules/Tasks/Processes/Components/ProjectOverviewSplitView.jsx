import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { TaskContext } from '../../Context';
import ProjectSteps from './Steps';

export default function ProjectOverviewSplitView({ data, refetch, handleProjectStepClick }) {
  const { setSelectedStep, handleStepCompletion } = useContext(TaskContext);
  const matches = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Grid container style={matches ? { marginLeft: '-20px' } : { marginLeft: 0 }}>
        <Grid item md={12} data-testid="requirements-section">
          <Typography variant="subtitle1" style={{fontWeight: 400}}>Requirements</Typography>
          <Typography variant="caption">Please read the required guideline. </Typography>
          <Link to="/news/post/8">
            <Typography variant="caption">Go to Guideline.</Typography>
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

ProjectOverviewSplitView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Step)).isRequired,
  refetch: PropTypes.func.isRequired,
  handleProjectStepClick: PropTypes.func.isRequired
};

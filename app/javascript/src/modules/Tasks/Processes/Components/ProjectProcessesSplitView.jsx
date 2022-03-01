import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { useMediaQuery } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { TaskContext } from "../../Context";
import SplitScreen from '../../../../shared/SplitScreen';
import TaskUpdate from '../../containers/TaskUpdate';

export default function ProjectProcessesSplitView({
  splitScreenOpen,
  setSplitScreenOpen,
  handleProjectStepClick,
  refetch,
  commentsRefetch
}) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');
  const { projectId, selectedStep, handleStepCompletion } = useContext(TaskContext);

  return (
    <>
      {matches ? (
        <SplitScreen
          open={splitScreenOpen}
          onClose={() => setSplitScreenOpen(false)}
          classes={{ paper: classes.drawerPaperMobile }}
        >
          <TaskUpdate
            taskId={selectedStep?.id || projectId}
            handleSplitScreenOpen={handleProjectStepClick}
            handleSplitScreenClose={() => setSplitScreenOpen(false)}
            handleTaskCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
            commentsRefetch={commentsRefetch}
            forProcess
          />
        </SplitScreen>
        ) : (
          <TaskUpdate
            taskId={selectedStep?.id || projectId}
            handleSplitScreenOpen={handleProjectStepClick}
            handleSplitScreenClose={() => setSplitScreenOpen(false)}
            handleTaskCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
            commentsRefetch={commentsRefetch}
            forProcess
          />
      )}
    </>
  )
}

const useStyles = makeStyles(() => ({
  drawerPaperMobile: {
    width: '100%',
    marginTop: '51px',
    opacity: '1',
    backgroundColor: "#FFFFFF !important",
    padding: '20px'
  },
}));

ProjectProcessesSplitView.defaultProps = {
  commentsRefetch: () => {}
}

ProjectProcessesSplitView.propTypes = {
  refetch: PropTypes.func.isRequired,
  splitScreenOpen: PropTypes.bool.isRequired,
  setSplitScreenOpen: PropTypes.func.isRequired,
  handleProjectStepClick: PropTypes.func.isRequired,
  commentsRefetch: PropTypes.func
 }

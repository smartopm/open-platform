import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TaskContext } from '../../Context';
import SplitScreen from '../../../../shared/SplitScreen';
import TaskUpdate from '../../containers/TaskUpdate';

export default function ProjectProcessesSplitView({
  splitScreenOpen,
  setSplitScreenOpen,
  handleProjectStepClick,
  refetch,
  commentsRefetch
}) {
  const { projectId, selectedStep, handleStepCompletion } = useContext(TaskContext);

  return (
    <>
      <SplitScreen
        open={splitScreenOpen}
        onClose={() => setSplitScreenOpen(false)}
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
    </>
  );
}

ProjectProcessesSplitView.defaultProps = {
  commentsRefetch: () => {}
};

ProjectProcessesSplitView.propTypes = {
  refetch: PropTypes.func.isRequired,
  splitScreenOpen: PropTypes.bool.isRequired,
  setSplitScreenOpen: PropTypes.func.isRequired,
  handleProjectStepClick: PropTypes.func.isRequired,
  commentsRefetch: PropTypes.func
};

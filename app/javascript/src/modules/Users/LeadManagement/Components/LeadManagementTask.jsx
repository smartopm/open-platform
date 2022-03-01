import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import TaskUpdate from '../../../Tasks/containers/TaskUpdate';
import CenteredContent from '../../../../shared/CenteredContent';

export default function LeadManagementTask({ taskId }) {
  const { t } = useTranslation('task');
  const history = useHistory();
  function handleTodoItemClick(task, tab) {
    history.push({
      pathname: '/tasks',
      search: `?taskId=${task?.id}&detailTab=${tab}`,
      state: { from: history.location.pathname, search: history.location.search }
    });
    window.document.getElementById('anchor-section').scrollIntoView();
  }

  return (
    <div style={{ margin: '0 -45px 0 -45px' }}>
      {taskId !== null ? (
        <TaskUpdate taskId={taskId} handleSplitScreenOpen={handleTodoItemClick} fromLeadPage />
      ) : (
        <CenteredContent>{t('task.no_tasks')}</CenteredContent>
      )}
    </div>
  );
}

LeadManagementTask.defaultProps = {
  taskId: null
};

LeadManagementTask.propTypes = {
  taskId: PropTypes.string
};

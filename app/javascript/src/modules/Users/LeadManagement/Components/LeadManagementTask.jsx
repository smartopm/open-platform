import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import TaskUpdate from '../../../Tasks/containers/TaskUpdate';
import CenteredContent from '../../../../shared/CenteredContent';

export default function LeadManagementTask({ taskId }) {
  const { t } = useTranslation('task');

  return (
    <Grid container style={{ margin: '0 -45px 0 -45px' }}>
      {taskId !== null ? (
        <TaskUpdate taskId={taskId} />
      ) : (
        <CenteredContent>{t('task.no_tasks')}</CenteredContent>
      )}
    </Grid>
  );
}

LeadManagementTask.defaultProps = {
  taskId: null
};

LeadManagementTask.propTypes = {
  taskId: PropTypes.string
};

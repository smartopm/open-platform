import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'react-i18next';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import CenteredContent from '../../../shared/CenteredContent';
import TaskAddForm from './TaskForm';

export default function AddSubTask({ refetch, assignUser, users, taskId}) {
  const [open, setModalOpen] = useState(false);
  const { t } = useTranslation(['task', 'common']);
  function handleAddSubTask() {
    setModalOpen(true);
  }
  return (
    <>
      <Dialog
        fullScreen
        open={open}
        fullWidth
        maxWidth="lg"
        onClose={() => setModalOpen(!open)}
        aria-labelledby="task_modal"
      >
        <DialogTitle id="task_modal">
          <CenteredContent>{t('task.task_modal_create_text')}</CenteredContent>
        </DialogTitle>
        <DialogContent>
          <TaskAddForm
            refetch={refetch}
            close={() => setModalOpen(!open)}
            assignUser={assignUser}
            users={users}
            parentTaskId={taskId}
          />
        </DialogContent>
      </Dialog>
      <AccessCheck module="note" allowedPermissions={['can_view_create_sub_task_button']}>
        <IconButton
          edge="end"
          onClick={handleAddSubTask}
          data-testid="add_sub_task_icon"
          color="primary"
          style={{ backgroundColor: 'transparent' }}
        >
          <div style={{ display: 'flex' }}>
            <AddCircleIcon />
            <Typography color="primary" style={{ padding: '2px 0 0 5px' }} variant="caption">
              Add Task
            </Typography>
          </div>
        </IconButton>
      </AccessCheck>
    </>
  )
}

AddSubTask.defaultProps = {
  refetch: () => {}
}

AddSubTask.propTypes = {
  refetch: PropTypes.func,
  assignUser: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  taskId: PropTypes.string.isRequired
};
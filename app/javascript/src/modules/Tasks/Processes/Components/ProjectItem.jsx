import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation, useApolloClient } from 'react-apollo';
import { useHistory } from 'react-router';
import { formatError } from '../../../../utils/helpers';
import { UpdateNote } from '../../../../graphql/mutations';
import useFileUpload from '../../../../graphql/useFileUpload';
import TodoItem from '../../Components/TodoItem';

export default function ProjectItem({ task, taskId, refetch, clientView }) {
  const { t } = useTranslation('task');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskUpdate] = useMutation(UpdateNote);
  const [taskUpdateStatus, setTaskUpdateStatus] = useState({ message: '', success: false });
  const { onChange, signedBlobId, status } = useFileUpload({
    client: useApolloClient()
  });
  const history = useHistory();

  useEffect(() => {
    if (status === 'DONE') {
      taskUpdate({ variables: { id: selectedTask.id, documentBlobId: signedBlobId } })
        .then(() => {
          refetch();
        })
        .catch(error => {
          setTaskUpdateStatus({
            ...taskUpdateStatus,
            success: false,
            message: formatError(error.message)
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, selectedTask, signedBlobId, taskUpdate, refetch]);

  function handleChange(selectedId) {
    if (selectedTasks.includes(selectedId)) {
      const currentTasks = selectedTasks.filter(id => id !== selectedId);
      setSelectedTasks([...currentTasks]);
    } else {
      setSelectedTasks([...selectedTasks, selectedId]);
    }
  }

  function handleAddSubTask({ id }) {
    redirectToOverviewPage(id);
  }

  function handleTodoItemClick(taskItem, tab = 'processes', detailTab) {
    redirectToOverviewPage(taskItem.id, tab, detailTab);
  }

  function handleTaskCompletion(selectedTaskId, completed) {
    taskUpdate({ variables: { id: selectedTaskId, completed } })
      .then(() => {
        refetch();
        setTaskUpdateStatus({
          ...taskUpdateStatus,
          success: true,
          message: `${t('task.task_marked_as')} ${
            completed ? t('task.complete') : t('task.incomplete')
          }`
        });
      })
      .catch(err => {
        setTaskUpdateStatus({
          ...taskUpdateStatus,
          success: false,
          message: formatError(err.message)
        });
      });
  }

  function handleUploadDocument(event, todoItem) {
    onChange(event.target.files[0]);
    setSelectedTask(todoItem);
  }

  function redirectToOverviewPage(id, tab = 'processes', detailTab) {
    history.push(`/processes/projects/${id}?tab=${tab}&detailTab=${detailTab}`);
  }

  return (
    <TodoItem
      key={task?.id}
      task={task}
      taskId={taskId}
      handleChange={handleChange}
      selectedTasks={selectedTasks}
      isSelected={false}
      handleAddSubTask={handleAddSubTask}
      handleUploadDocument={handleUploadDocument}
      handleTodoClick={handleTodoItemClick}
      handleTaskCompletion={handleTaskCompletion}
      clientView={clientView}
      showWidgetsIcon
    />
  );
}

ProjectItem.defaultProps = {
  clientView: false,
  taskId: null,
  task: null
};
ProjectItem.propTypes = {
  task: PropTypes.shape({ id: PropTypes.string }),
  refetch: PropTypes.func.isRequired,
  clientView: PropTypes.bool,
  taskId: PropTypes.string
};

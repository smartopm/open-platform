import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { UpdateNote } from '../graphql/task_mutation';
import { formatError } from '../../../utils/helpers';

export const TaskContext = createContext({});

export default function TaskContextProvider({ children }) {
  const authState = useContext(AuthStateContext)
  const { id: projectId } = useParams();
  const { t } = useTranslation('task');
  const [selectedStep, setSelectedStep] = useState(null)
  const [updateStatus, setUpdateStatus] = useState({ message: '', success: false });

  const [taskUpdate] = useMutation(UpdateNote)

  function handleStepCompletion(stepItemId, completed, refetch = null){
    setUpdateStatus({
      ...updateStatus,
      [stepItemId]: true,
    })

    taskUpdate({variables: {  id: stepItemId, completed }})
      .then(() => {
        refetch();
        setUpdateStatus({
          ...updateStatus,
          success: true,
          message: `${t('task.task_marked_as')} ${completed ? t('task.complete') : t('task.incomplete')}`,
          [stepItemId]: false,
        })
      })
      .catch((error) => {
        setUpdateStatus({
          ...updateStatus,
          success: false,
          message: formatError(error.message),
          [stepItemId]: false,
        })
      });
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setUpdateStatus({
      ...updateStatus,
      message: '',
    })
  }

  return (
    <TaskContext.Provider
      value={{
        projectId,
        selectedStep,
        setSelectedStep,
        handleStepCompletion,
        authState,
        updateStatus,
        handleMessageAlertClose,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

TaskContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

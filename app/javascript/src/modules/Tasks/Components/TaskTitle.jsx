import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { removeNewLines, sanitizeText } from '../../../utils/helpers';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { UserFormPropertiesQuery } from '../../Forms/graphql/forms_queries';
import { taskTitleContent } from '../utils';

export default function TaskTitle({ task }) {
  const authState = useContext(AuthStateContext);
  const { data: formData, error: formDataError, loading: formDataLoading } = useQuery(
    UserFormPropertiesQuery,
    {
      variables: { userId: authState.user.id, formUserId: task.formUserId },
      fetchPolicy: 'cache-and-network'
    }
  );

  if (formDataLoading) return <span data-testid="loader"/>;
  const projectDeveloper = formData?.formUserProperties?.find(
    f => f.formProperty.fieldName === 'Project Developer'
  );

  return(
    <span
      data-testid='task-title'
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: sanitizeText(removeNewLines(
          projectDeveloper ?
          taskTitleContent(task.body, projectDeveloper, formDataError) : task.body
          ))
      }}
    />
  )
}

TaskTitle.propTypes = {
  task: PropTypes.shape({
    body: PropTypes.string.isRequired,
    formUserId: PropTypes.string.isRequired
  }).isRequired,
};

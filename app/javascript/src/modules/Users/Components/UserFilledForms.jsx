import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from 'react-apollo';
import CenteredContent from '../../../components/CenteredContent';
import FormItem from '../../Forms/UserForms/Components/FormItem';
import { SubmittedFormCommentsQuery } from '../../Forms/graphql/forms_queries';

export default function UserFilledForms({ userFormsFilled, userId, currentUser }) {
  const { t } = useTranslation('common');
  const [currentFormUserId, setCurrentFormUserId] = useState(null);
  const [fetchComments, { data }] = useLazyQuery(SubmittedFormCommentsQuery)

  function handleShowComments(event, formId){
    event.stopPropagation();
    setCurrentFormUserId(formId);
    fetchComments({ variables: { formUserId: formId } });
  }

  console.log(data);
  if (!userFormsFilled || !userFormsFilled.length) {
    return <CenteredContent>{t('misc.no_forms')}</CenteredContent>;
  }

  return (
    <div className="container">
      {userFormsFilled.length &&
        userFormsFilled.map(
          userForm =>
            (userForm.status !== 'draft' || userForm.userId === currentUser) && (
              <Fragment key={userForm.id}>
                <FormItem
                  formUser={userForm}
                  handleShowComments={handleShowComments}
                  currentFormUserId={currentFormUserId}
                  userId={userId}
                />
                <Divider />
              </Fragment>
            )
        )}
    </div>
  );
}

UserFilledForms.defaultProps = {
  userFormsFilled: []
};

UserFilledForms.propTypes = {
  userFormsFilled: PropTypes.arrayOf(
    PropTypes.shape({
      form: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })
    })
  ),
  userId: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired
};
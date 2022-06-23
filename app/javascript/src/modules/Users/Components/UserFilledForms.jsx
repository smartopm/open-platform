/* eslint-disable no-use-before-define */
import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { Grid, useMediaQuery } from '@mui/material';
import { useQuery, useLazyQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import FormItem from '../../Forms/UserForms/Components/FormUserItem';
import { FormsQuery, SubmittedFormCommentsQuery } from '../../Forms/graphql/forms_queries';
import CenteredContent from '../../../shared/CenteredContent';
import SelectButton from '../../../shared/buttons/SelectButton';
import { Spinner } from '../../../shared/Loading';
import { formatError } from '../../../utils/helpers';
import PageWrapper from '../../../shared/PageWrapper';

export default function UserFilledForms({ userFormsFilled, userId, currentUser }) {
  const { data, error, loading } = useQuery(FormsQuery, {
    variables: { userId: userId !== currentUser ? userId : currentUser },
    fetchPolicy: 'cache-and-network'
  });

  const history = useHistory();
  const { t } = useTranslation('common');
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentFormUserId, setCurrentFormUserId] = useState(null);
  const [fetchComments, formData] = useLazyQuery(SubmittedFormCommentsQuery, {
    fetchPolicy: 'cache-and-network'
  });

  const mobile = useMediaQuery('(max-width:800px)');

  function handleClose() {
    setAnchorEl(null);
    setOpen(false);
  }

  const menuOptions = data?.forms?.map(form => ({
    key: form.id,
    value: form.name,
    name: form.name,
    handleMenuItemClick: () =>
      userId !== currentUser
        ? history.push(`/form/${form.id}/private?userId=${userId}`)
        : history.push(`/form/${form.id}/private`),
    show: true
  }));

  function handleShowComments(event, formId) {
    event.stopPropagation();
    setCurrentFormUserId(formId);
    fetchComments({ variables: { formUserId: formId } });
  }

  function handleSelectButtonClick(e) {
    setOpen(!open);
    setAnchorEl(e.currentTarget);
  }

  const rightPanelObj = [
    {
      mainElement: (
        <SelectButton
          options={menuOptions}
          open={open}
          anchorEl={anchorEl}
          handleClose={handleClose}
          handleClick={handleSelectButtonClick}
          defaultButtonText={t('common:menu.submit_form')}
          style={{ marginLeft: mobile && '-40px' }}
        />
      ),
      key: 1
    }
  ];

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  return (
    <PageWrapper pageTitle={t('menu.form', { count: 0 })} rightPanelObj={rightPanelObj}>
      {!userFormsFilled ||
        (!userFormsFilled.length && (
          <>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{ marginTop: 20 }}
            >
              {t('misc.no_forms')}
            </Grid>
          </>
        ))}

      <div>
        {userFormsFilled?.length >= 1 &&
          userFormsFilled.map(
            userForm =>
              (userForm.status !== 'draft' || userForm.userId === currentUser) && (
                <Fragment key={userForm.id}>
                  <FormItem
                    formUser={userForm}
                    handleShowComments={handleShowComments}
                    currentFormUserId={currentFormUserId}
                    formData={formData}
                    userId={userId}
                    t={t}
                  />
                  <Divider />
                </Fragment>
              )
          )}
      </div>
    </PageWrapper>
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

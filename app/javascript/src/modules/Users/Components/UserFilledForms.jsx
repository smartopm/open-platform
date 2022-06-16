/* eslint-disable no-use-before-define */
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import Badge from '@mui/material/Badge';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { css, StyleSheet } from 'aphrodite';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import DateContainer from '../../../components/DateContainer';
import colors from '../../../themes/nkwashi/colors';
import CenteredContent from '../../../components/CenteredContent';
import FormItem from '../../Forms/UserForms/Components/FormItem';

const { gray } = colors;
export default function UserFilledForms({ userFormsFilled, userId, currentUser }) {
  const { t } = useTranslation('common');
  const [currentFormUserId, setCurrentFormUserId] = useState(null);

  function handleShowComments(event, formId){
    event.stopPropagation();
    setCurrentFormUserId(formId);
  }

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

const styles = StyleSheet.create({
  timeStamp: {
    float: 'right',
    fontSize: 14,
    color: gray
  }
});

{
  /* <ListItem
                alignItems="flex-start"
                key={userForm.id}
                button
                data-testid="form_item"
                onClick={() => handleViewForm(userForm.id, userForm.form.id)}
              >
                <ListItemText
                  primary={(
                    <>
                      <span className="nz_msg_owner">
                        {userForm.form?.name}
                        <Badge
                          color="secondary"
                          badgeContent={<span>{userForm.status}</span>}
                          style={{ marginLeft: 35 }}
                        />

                        <span className={css(styles.timeStamp)}>
                          {t('misc.created_at')}
                          :
                          <DateContainer date={userForm.createdAt} />
                        </span>
                      </span>
                    </>
                  )}
                />
              </ListItem> */
}
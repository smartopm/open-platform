import React from 'react';
import { ListItem, Typography, IconButton, ListItemText } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import ForumIcon from '@mui/icons-material/Forum';
import CommentCard from '../../../Tasks/Components/CommentCard';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';

export default function FormItem({
  formUser,
  handleShowComments,
  currentFormUserId,
  userId,
  formData,
  t
}) {
  const history = useHistory();
  const currentForm = currentFormUserId === formUser.id;
  const hasComments = currentForm && formData.data && formData.data?.formComments?.length;
  const hasNoComments = currentForm && !formData.loading && !hasComments;
  return (
    <>
      <ListItem
        key={formUser.id}
        data-testid="community_form"
        onClick={() =>
          history.push(`/user_form/${userId}/${formUser.id}?formId=${formUser.form.id}`)
        }
      >
        <ListItemText
          primary={(
            <>
              <Typography variant="h6" color="textSecondary" data-testid="disc_title">
                {formUser.form.name}
              </Typography>
              <IconButton
                onClick={event => handleShowComments(event, formUser.id)}
                style={{ float: 'right', marginTop: -40 }}
                edge="end"
                aria-label="delete"
                size="large"
              >
                <ForumIcon />
              </IconButton>
            </>
          )}
          secondary={(
            <>
              <Typography component="span" variant="body2" color="textPrimary">
                Submitted: 
                {' '}
                {new Date().toDateString()}
              </Typography>
            </>
          )}
        />
      </ListItem>
      {currentForm && formData.loading && <Spinner />}
      {hasComments ? (
        <CommentCard comments={formData.data.formComments} refetch={() => {}} />
      ) : (
        hasNoComments && (
          <CenteredContent>{t('task:task.no_comments_on_this_form')}</CenteredContent>
        )
      )}
      <br />
    </>
  );
}

FormItem.propTypes = {
  formUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    form: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  handleShowComments: PropTypes.func.isRequired,
  currentFormUserId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  formComments: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  formData: PropTypes.object.isRequired
};

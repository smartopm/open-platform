import React from 'react';
import { ListItem, Box, Typography, Grid, IconButton, ListItemText } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import ForumIcon from '@mui/icons-material/Forum';

export default function FormItem({ formUser, handleShowComments, currentFormUserId, userId }) {
  const history = useHistory();
  return (
    <>
      <ListItem
        key={formUser.id}
        data-testid="community_form"
        // onClick={() => history.push(`/form/${formUser.id}/private`)}
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
      {currentFormUserId === formUser.id && 'I am a list of comments just for this one here'}
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
  userId: PropTypes.string.isRequired
};

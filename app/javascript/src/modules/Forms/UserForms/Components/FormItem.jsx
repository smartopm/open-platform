import React from 'react'
import { ListItem, Box, Typography, Grid, IconButton, ListItemText } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import ForumIcon from '@mui/icons-material/Forum';

export default function FormItem({ form, handleShowComments }) {
  const history = useHistory()
  const [showComments, setShowComments] = React.useState(false)
  // function handleShowComments() {
  //   console.log('show comments')
  //   setShowComments(!showComments);
  // }
  return (
    <>
      <ListItem
        key={form.id}
        data-testid="community_form"
        onClick={() => history.push(`/form/${form.id}/private`)}
      >
        <ListItemText
          primary={(
            <>
              <Typography variant="h6" color="textSecondary" data-testid="disc_title">
                {form.name}
              </Typography>
              <IconButton
                onClick={event => handleShowComments(event, form.id)}
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
      {showComments && 'I am a list of comments just for this one here' }
    </>
  );
}

FormItem.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  handleShowComments: PropTypes.func.isRequired,
}
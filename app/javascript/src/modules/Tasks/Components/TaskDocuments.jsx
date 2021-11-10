import React from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import { dateToString } from '../../../components/DateContainer';

export default function TaskDocuments({ documents }) {
  return (
    <List>
      {documents.map(doc => (
        <ListItem key={doc.id}>
          <ListItemText
            primary={doc.name}
            secondary={(
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  Uploaded at:
                  {' '}
                  {dateToString(doc.created_at)}
                </Typography>
              </>
              )}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="more_details">
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

TaskDocuments.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  ).isRequired
};

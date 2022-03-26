import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { dateToString } from '../components/DateContainer';

export default function NoteListItem({ hasActions, note, handleOpenMenu }) {
  const classes = useStyles();
  return (
    <ListItem className={classes.alignItem}>
      <ListItemText
        disableTypography
        secondary={(
          <>
            <Typography variant="body2" data-testid="note_created_at">
              {dateToString(note.createdAt)}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              className={classes.noteBody}
              data-testid="note_body"
            >
              {note.body}
            </Typography>
          </>
        )}
      />
      {hasActions && (
        <ListItemSecondaryAction className={classes.kabab}>
          <IconButton
            edge="end"
            aria-label="more_details"
            data-testid="more_details"
            onClick={event => handleOpenMenu(event, note)}
            color="primary"
            size="large"
          >
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

const useStyles = makeStyles(() => ({
  kabab: {
    '@media (min-device-width: 375px) and (max-device-height: 900px)': {
      top: '40%'
    }
  },
  noteBody: {
    color: '#575757',
    overflowWrap: 'anywhere'
  },
  alignItem: {
    marginLeft: -15
  }
}));

NoteListItem.defaultProps = {
  hasActions: false,
  handleOpenMenu: () => {}
};

NoteListItem.propTypes = {
  hasActions: PropTypes.bool,
  note: PropTypes.shape({
    body: PropTypes.string,
    createdAt: PropTypes.string
  }).isRequired,
  handleOpenMenu: PropTypes.func
};

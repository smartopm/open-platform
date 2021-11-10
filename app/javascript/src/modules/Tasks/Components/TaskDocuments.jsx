import React, { Fragment, useState } from 'react';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../components/DateContainer';

export default function TaskDocuments({ documents }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [docId, setDocId] = useState('');
  const { t } = useTranslation('common');

  const menuOpen = Boolean(anchorEl);

  function handleOpenMenu(event, id) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setDocId(id);
  }

  return (
    <>
      <List>
        {documents.map(doc => (
          <Fragment key={doc.id}>
            <ListItem>
              <ListItemText
                primary={doc.filename}
                secondary={(
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {`Uploaded at: ${dateToString(doc.created_at)}`}
                    </Typography>
                  </>
                )}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="more_details"
                  onClick={event => handleOpenMenu(event, doc.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>

            <Divider variant="middle" />
          </Fragment>
        ))}
      </List>
      <Menu
        id={`long-menu-${docId}`}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        keepMounted={false}
        PaperProps={{
          style: {
            width: 200
          }
        }}
      >
        <MenuItem id="download_button" key="download">
          Download
        </MenuItem>
        <MenuItem id="delete_button" key="delete">
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

TaskDocuments.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      filename: PropTypes.string
    })
  ).isRequired
};

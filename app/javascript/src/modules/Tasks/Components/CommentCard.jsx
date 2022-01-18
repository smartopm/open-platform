/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import React, { Fragment, useState, useContext } from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TaskDelete from './TaskDelete';
import EditField from './TaskCommentEdit';
import { dateToString } from '../../../components/DateContainer';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';

export default function CommentCard({ comments, refetch }) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState(null);
  const [body, setBody] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const menuOpen = Boolean(anchorEl);
  const authState = useContext (AuthStateContext);
  const classes = useStyles();

  const { t } = useTranslation('common');

  function handleClose() {
    setEdit(false);
    setEditId(null);
  }

  function deleteClick(comment) {
    setId(comment.id);
    setImageUrl(comment.user.imageUrl);
    setName(comment.user.name);
    setBody(comment.body);
    setOpen(true);
    setAnchorEl(null);
  }

  function editClick(comment) {
    setEditId(comment.id);
    setAnchorEl(null);
  }

  function handleOpenMenu(event, comment) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentComment(comment);
  }

  return (
    <>
      <>
        <Menu
          id={`comment-menu-${currentComment.id}`}
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          keepMounted={false}
          data-testid="more_details_menu"
        >
          <MenuItem id="edit_button" data-testid="edit" key="edit" onClick={() => editClick(currentComment)}>
            {t('common:menu.edit')}
          </MenuItem>
          <MenuItem id="delete_button" data-testid="delete" key="delete" onClick={() => deleteClick(currentComment)}>
            {t('common:menu.delete')}
          </MenuItem>
        </Menu>
        <List>
          {comments?.map(com => (
            <Fragment key={com.id}>
              {!edit && editId !== com.id && (
                <ListItem>
                  <ListItemText
                    disableTypography
                    secondary={(
                      <div style={{ display: 'flex' }}>
                        <Avatar
                          src={com.user.imageUrl}
                          alt="avatar-image"
                          style={{ margin: '-7px 10px 0 0' }}
                        />
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ color: '#575757' }}
                          data-testid="comment-body"
                        >
                          {dateToString(com.createdAt)}
                          {' '}
                          {com.body}
                        </Typography>
                      </div>
                    )}
                  />
                  {(authState.user.userType === 'admin' || (com.user.id === authState.user.id)) && (
                    <ListItemSecondaryAction className={classes.kabab}>
                      <IconButton
                        edge="end"
                        aria-label="more_details"
                        data-testid="more_details"
                        onClick={event => handleOpenMenu(event, com)}
                        color="primary"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              )}
              {editId === com.id && (
                <EditField handleClose={handleClose} data={com} refetch={refetch} />
              )}
            </Fragment>
          ))}
        </List>
      </>
      {open && (
        <TaskDelete
          open={open}
          handleClose={() => setOpen(false)}
          id={id}
          name={name}
          imageUrl={imageUrl}
          refetch={refetch}
          body={body}
        />
      )}
    </>
  );
}

CommentCard.defaultProps = {
  comments: []
};
CommentCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  comments: PropTypes.array,
  refetch: PropTypes.func.isRequired
};

const useStyles = makeStyles(() => ({
  kabab: {
    '@media (min-device-width: 375px) and (max-device-height: 900px)': {
      top: '40%'
    }
  }
}));

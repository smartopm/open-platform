/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import React from 'react'
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { useMutation } from 'react-apollo'
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { DeleteNoteComment } from '../../../graphql/mutations';

export default function TaskDelete({ open, handleClose, id, name, imageUrl, body, refetch, commentsRefetch }) {
  const classes = useStyles();
  const [commentDelete] = useMutation(DeleteNoteComment);
  const { t } = useTranslation('task', 'common');

  function handleDelete(comId) {
    commentDelete({ variables: {
      id: comId
    }}).then(() => {
      handleClose()
      refetch()
      commentsRefetch()
    })
  }

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} className={classes.title}>
          {t('task.delete_confirmation_text')}
        </DialogTitle>
        <DialogContent style={{ margin: '15px' }}>
          <Card style={{ display: 'flex' }} className={classes.root}>
            <Avatar src={imageUrl} alt="avatar-image" style={{ marginTop: '7px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent>
                <Typography className={classes.deleteCard} gutterBottom>
                  {name}
                </Typography>
                <Typography variant="caption" component="h2">
                  {body}
                </Typography>
              </CardContent>
            </div>
          </Card>
        </DialogContent>
        <Divider />
        <DialogActions style={{ margin: '10px' }}>
          <Button onClick={handleClose} variant="outlined" color="secondary" data-testid='cancel-delete'>
            {t('common:form_actions.cancel')}
          </Button>
          <Button autoFocus data-testid='button' onClick={() => handleDelete(id)} variant="contained" style={{ backgroundColor: '#dc402b', color: 'white' }}>
            {t('common:form_actions.save_changes')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  title: {
    backgroundColor: '#fcefef',
    color: '#dc402b',
    borderBottom: '1px #f1a3a2 solid'
  },
  deleteCard: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

TaskDelete.defaultProps = {
  commentsRefetch: () => {}
}

TaskDelete.propTypes = {
   id: PropTypes.string.isRequired,
   body: PropTypes.string.isRequired,
   imageUrl: PropTypes.string.isRequired,
   name: PropTypes.string.isRequired,
   refetch: PropTypes.func.isRequired,
   open: PropTypes.bool.isRequired,
   handleClose: PropTypes.func.isRequired,
   commentsRefetch: PropTypes.func
 }

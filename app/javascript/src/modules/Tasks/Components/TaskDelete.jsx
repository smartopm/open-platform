/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { useMutation } from 'react-apollo'
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { DeleteNoteComment } from '../../../graphql/mutations';

export default function TaskDelete({ open, handleClose, id, name, imageUrl, body, refetch }) {
  const classes = useStyles();
  const [commentDelete] = useMutation(DeleteNoteComment);
  const { t } = useTranslation('task', 'common');

  function handleDelete(comId) {
    commentDelete({ variables: {
      id: comId
    }}).then(() => {
      handleClose()
      refetch()
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

 TaskDelete.propTypes = {
   id: PropTypes.string.isRequired,
   body: PropTypes.string.isRequired,
   imageUrl: PropTypes.string.isRequired,
   name: PropTypes.string.isRequired,
   refetch: PropTypes.func.isRequired,
   open: PropTypes.bool.isRequired,
   handleClose: PropTypes.func.isRequired
 }

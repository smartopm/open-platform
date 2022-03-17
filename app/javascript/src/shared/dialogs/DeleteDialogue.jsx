import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import {Spinner} from '../Loading'

export default function DeleteDialogueBox({
  open,
  handleClose,
  handleAction,
  title,
  action,
  user,
  loading,
  additionalNote,
}) {
  const classes = useStyles();
  const { t } = useTranslation('common')

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.title} data-testid="delete_dialog">
          <WarningIcon style={{paddingTop: '10px'}} />
          <span style={{fontSize: '14px', margin: '0 30px 0 7px'}}>{t('dialogs.dialog_action', { action, title })}</span>
          <IconButton
            style={{paddingTop: '5px', color: '#dc402b'}}
            onClick={handleClose}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{margin: '30px 0', fontSize: '13px', textAlign: 'center'}} data-testid='delete-title'>
          {/* TODO: this needs refinement, action - title - user - null does not make sense */}
          { `${t('dialogs.dialog_content', { action, title })} ${user ? `for ${user}` : ''}` }
          <br />
          <b>{ additionalNote ? `Note:- ${additionalNote}` : null }</b>
        </DialogContent>
        <Divider />
        <DialogActions>
          {loading ? (<Spinner />) : (
            <>
              <Button onClick={handleClose} color="secondary" variant='outlined'>
                {t('form_actions.cancel')}
              </Button>
              <Button onClick={handleAction} variant='contained' className={classes.button} autoFocus data-testid="confirm_action">
                {action}
              </Button>
            </>
        )}
        </DialogActions>
      </Dialog>
    </>
);
}

DeleteDialogueBox.defaultProps = {
  action: 'delete',
  user: '',
  loading: false,
  additionalNote: '',
}

DeleteDialogueBox.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  action: PropTypes.string,
  user: PropTypes.string,
  loading: PropTypes.bool,
  additionalNote: PropTypes.string
}

const useStyles = makeStyles({
  title: {
    backgroundColor: '#fcefef',
    color: '#dc402b',
    borderBottom: '1px #f1a3a2 solid'
  },
  button: {
    backgroundColor: '#dc402b',
    color: 'white'
  }
});
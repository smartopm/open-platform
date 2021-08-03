import React, { useState } from 'react'
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import DeleteDialogueBox from '../../shared/dialogs/DeleteDialogue'
import { DeleteActionFlow } from '../../graphql/mutations'
import MessageAlert from '../MessageAlert'
import { formatError } from '../../utils/helpers'

export default function ActionFlowDelete({ open, handleClose, data, refetch }){
  const [deleteAction] = useMutation(DeleteActionFlow);
  const [messageAlert, setMessageAlert] = useState('')
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const { t } = useTranslation(['actionflow'])

  function handleDelete(){
    deleteAction({
      variables: { id: data.id }
    }).then(() => {
      setMessageAlert(t('actionflow:messages.delete_message'));
      setIsSuccessAlert(true);
      handleClose();
      refetch();
    }).catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
      handleClose();
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }


  return (
    <>
      <DeleteDialogueBox 
        open={open} 
        handleClose={handleClose}
        handleAction={handleDelete}
        action='delete'
        title={t('actionflow:headers.action_flow')}
      />
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />

    </>
  )
}

ActionFlowDelete.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired, 
  refetch: PropTypes.func.isRequired
}
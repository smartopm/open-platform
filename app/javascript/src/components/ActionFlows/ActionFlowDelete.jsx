import React, { useContext } from 'react'
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import DeleteDialogueBox from '../../shared/dialogs/DeleteDialogue'
import { DeleteActionFlow } from '../../graphql/mutations'
import { formatError } from '../../utils/helpers'
import { SnackbarContext } from '../../shared/snackbar/Context';

export default function ActionFlowDelete({ open, handleClose, data, refetch }){
  const [deleteAction] = useMutation(DeleteActionFlow);
  const { t } = useTranslation(['actionflow'])

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  function handleDelete(){
    deleteAction({
      variables: { id: data.id }
    }).then(() => {
      showSnackbar({ type: messageType.success, message: t('actionflow:messages.delete_message') })
      handleClose();
      refetch();
    }).catch((err) => {
      showSnackbar({ type: messageType.error, message: formatError(err.message) })
      handleClose();
    })
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
import { useContext } from 'react';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { formatError } from '../../utils/helpers';
import { SnackbarContext } from '../snackbar/Context';

export default function useMutationWrapper(query, reset) {
  const [createOrUpdate, { loading }] = useMutation(query);
  const { showSnackbar, messageType } = useContext(SnackbarContext);
  const { t } = useTranslation('common');

  /**
   * 
   * @param {{}} variables - These are variables that will be passed to the GraphQL 
   * Mutation that you've provided
   */
  function handleAction(variables) {
    createOrUpdate({ variables: { ...variables } })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('menu.task_deleted') });
        reset();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
      });
  }
  return [handleAction, loading];
}

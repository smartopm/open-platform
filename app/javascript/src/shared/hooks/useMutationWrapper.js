import { useContext } from 'react';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { formatError } from '../../utils/helpers';
import { SnackbarContext } from '../snackbar/Context';

/**
 * A Wrapper around useMutation to perform mutations and alert
 *  while returning the status of the mutation
 * @param {GraphQLNode} query - This should be a valid mutation from GraphQL
 * @param {Function} reset - Function to be called when a mutation is successful
 * @returns {Array} Array First argument being a function and loading status of the mutation
 */
export default function useMutationWrapper(mutation, reset) {
  const [createOrUpdate, { loading }] = useMutation(mutation);
  const { showSnackbar, messageType } = useContext(SnackbarContext);
  const { t } = useTranslation('common');

  /**
   * Perform GraphQL Mutation and Show snackbar accordingly
   * @param {object} variables - These are variables that will be passed to the GraphQL
   * Mutation that you've provided
   * @returns {Promise}
   */
  function handleAction(variables) {
    createOrUpdate({ variables: { ...variables } })
      .then(() => {
        // Find a better generic message that can work for all actions
        showSnackbar({ type: messageType.success, message: t('misc.update_successful') });
        reset();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
      });
  }
  return [handleAction, loading];
}

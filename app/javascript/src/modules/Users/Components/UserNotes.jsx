import React, { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CreateNote } from '../../../graphql/mutations';
import { UserNotesQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import NoteListItem from '../../../shared/NoteListItem';
import NoteTextField from '../../../shared/CommentTextField';
import { formatError } from '../../../utils/helpers';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function UserNotes({ userId, tabValue }) {
  const [value, setValue] = useState('');
  const [noteCreate, { loading: isLoading }] = useMutation(CreateNote);
  const { t } = useTranslation(['task', 'common']);

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const [loadNotes, { loading, error, refetch, data }] = useLazyQuery(UserNotesQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (tabValue === 2 || tabValue === 'Notes') {
      loadNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  function handleSubmit() {
    noteCreate({ variables: { userId, body: value, flagged: false } })
      .then(() => {
        showSnackbar({type: messageType.success, message: t('common:misc.misc_successfully_created', { type: t('common:menu.note') }) });
        setValue('');
        refetch();
      })
      .catch(err => {
        showSnackbar({type: messageType.error, message: formatError(err.message) });
      });
  }

  if (error) return error.message;

  return (
    <div style={{ marginLeft: -23, marginRight: -24 }}>
      <NoteTextField
        value={value}
        setValue={setValue}
        handleSubmit={handleSubmit}
        actionTitle={t('common:form_actions.save')}
        placeholder={t('task.add_note')}
        loading={isLoading}
      />
      {isLoading || (loading && <Spinner />)}
      {data?.userNotes.map(note => (
        <NoteListItem key={note.id} note={note} />
      ))}
    </div>
  );
}

UserNotes.propTypes = {
  tabValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  userId: PropTypes.string.isRequired
};

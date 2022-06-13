import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CreateNote } from '../../../graphql/mutations';
import { UserNotesQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import NoteListItem from '../../../shared/NoteListItem';
import NoteTextField from '../../../shared/CommentTextField';
import MessageAlert from '../../../components/MessageAlert';
import { formatError } from '../../../utils/helpers';

export default function UserNotes({ userId, tabValue }) {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [noteCreate, { loading: isLoading }] = useMutation(CreateNote);
  const { t } = useTranslation(['task', 'common']);
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
        setMessage({ ...message, isError: false, detail: t('common:misc.misc_successfully_created', { type: t('common:menu.note') }) });
        setValue('');
        refetch();
      })
      .catch(err => {
        setMessage({ ...message, isError: true, detail: formatError(err.message) });
      });
  }

  if (error) return error.message;

  return (
    <div style={{ marginLeft: -23, marginRight: -24 }}>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
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

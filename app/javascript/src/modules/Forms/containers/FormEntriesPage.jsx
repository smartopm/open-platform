import React, { useContext } from 'react';
import { useParams } from 'react-router';
import FormEntries from '../components/FormEntries';
import { Context } from '../../../containers/Provider/AuthStateProvider';

export default function FormEntriesPage(){
  const { formId } = useParams();
  const authState = useContext(Context);
  return ((authState.user.userType === 'admin') && <FormEntries formId={formId} />);
};

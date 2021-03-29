import React from 'react';
import { useParams } from 'react-router';
import FormBuilder from '../../components/Forms/FormBuilder';

export default function FormBuilderPage() {
  const { formId } = useParams();
  return <FormBuilder formId={formId} />;
}

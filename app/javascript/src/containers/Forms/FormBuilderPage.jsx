import React from 'react'
import { useParams } from 'react-router'
import FormBuilder from '../../components/Forms/FormBuilder'
import Nav from '../../components/Nav'

export default function FormBuilderPage(){
  const { formId} = useParams()
    return (
      <>
        <Nav navName="FormBuilder" />
        <FormBuilder formId={formId} />
      </>
    )
}
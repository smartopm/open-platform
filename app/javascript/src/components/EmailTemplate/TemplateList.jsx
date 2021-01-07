import React from 'react'
import { useQuery } from 'react-apollo'
import { MenuItem } from '@material-ui/core'
import { EmailTemplatesQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'

export default function TemplateList(){
    const {loading, error, data} = useQuery(EmailTemplatesQuery)
    if(loading) return <Spinner />
    if(error) return error.message
    return data.emailTemplates.map(template => (
      <MenuItem key={template.id} value={template.id}>{template.name}</MenuItem>
    ))
}
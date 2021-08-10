import React from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { EmailTemplatesQuery } from '../graphql/email_queries'
import { Spinner } from '../../../shared/Loading'

export default function TemplateList({ value, handleValue, isRequired }) {
  const { loading, error, data } = useQuery(EmailTemplatesQuery)

  if (loading) return <Spinner />
  if (error) return error.message
  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel>Select a template</InputLabel>
      <Select value={value} onChange={handleValue} required={isRequired} data-testid="template_list">
        {data?.emailTemplates.map(template => (
          <MenuItem key={template.id} value={template.id}>
            {template.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

TemplateList.propTypes = {
  value: PropTypes.string.isRequired,
  handleValue: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
}

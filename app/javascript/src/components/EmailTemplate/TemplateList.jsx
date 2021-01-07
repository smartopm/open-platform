import React from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { EmailTemplatesQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'

export default function TemplateList({ value, handleValue, createTemplate }) {
  const { loading, error, data } = useQuery(EmailTemplatesQuery)
  if (loading) return <Spinner />
  if (error) return error.message
  return (
    <FormControl style={{ width: '90%' }}>
      <InputLabel id="template_list">Select a template</InputLabel>
      <Select value={value} onChange={handleValue}>
        <MenuItem key={1} value="1332712" onClick={createTemplate}>
          Create a new template
        </MenuItem>
        {data.emailTemplates.map(template => (
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
  createTemplate: PropTypes.func.isRequired
}

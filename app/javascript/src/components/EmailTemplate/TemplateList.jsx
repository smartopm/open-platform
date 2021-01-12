import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { EmailTemplatesQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'

export default function TemplateList({ value, handleValue, createTemplate, shouldRefecth, isRequired }) {
  const { loading, error, data, refetch } = useQuery(EmailTemplatesQuery)

  useEffect(() => {
    if (!loading || !error) {
      refetch()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefecth])

  if (loading) return <Spinner />
  if (error) return error.message
  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel id="template_list">Select a template</InputLabel>
      <Select value={value} onChange={handleValue} required={isRequired}>
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
  createTemplate: PropTypes.func.isRequired,
  shouldRefecth: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
}

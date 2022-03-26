import React from 'react';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { EmailTemplatesQuery } from '../graphql/email_queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';
import { formatError } from '../../../utils/helpers';

export default function TemplateList({ value, handleValue, isRequired }) {
  const { loading, error, data } = useQuery(EmailTemplatesQuery);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <CenteredContent>
        <p data-testid="error_section">{formatError(error.message)}</p>
      </CenteredContent>
    );
  }
  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel style={{ padding: '0 10px' }}>Select a template</InputLabel>
      <Select
        value={value}
        variant="outlined"
        label="Select a template"
        onChange={handleValue}
        required={isRequired}
        data-testid="template_list"
      >
        {data?.emailTemplates.map(template => (
          <MenuItem key={template.id} value={template.id}>
            {template.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

TemplateList.propTypes = {
  value: PropTypes.string.isRequired,
  handleValue: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired
};

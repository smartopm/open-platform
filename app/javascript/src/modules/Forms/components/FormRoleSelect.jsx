import React from 'react';
import Autocomplete from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

export default function FormRoleSelect({ data, handleChange, inputLabel, roles }) {
  const { t } = useTranslation('form');
  return (
    <>
      <Autocomplete
        data-testid="roles-select"
        style={{ width: '100%' }}
        multiple
        freeSolo
        id="tags-filled"
        options={data || []}
        getOptionLabel={role => role}
        value={roles || []}
        onChange={(_event, newValue) => {
        return handleChange(newValue);
      }}
        renderTags={(values, getTagProps) => {
        return values.map((role, index) => (
          <Chip
            key={role}
            variant="outlined"
            label={t(`common:user_types.${role}`)}
            {...getTagProps({ index })}
          />
        ));
      }}
        renderInput={params => (
          <TextField {...params} label={inputLabel} style={{ width: '100%' }} variant="outlined" />
      )}
      />
    </>
  );
}

FormRoleSelect.defaultProps = {
  roles: [],
  data: []
}

FormRoleSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  handleChange: PropTypes.func.isRequired,
  inputLabel: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object]))
};

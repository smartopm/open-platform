import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

export default function FormRoleSelect({ data, handleChange, inputLabel, roles }) {
  const { t } = useTranslation('form');
  return (
    <>
    {console.log(roles)}
    <Autocomplete
      data-testid="campaignLabel-creator"
      style={{ width: '100%' }}
      multiple
      freeSolo
      id="tags-filled"
      options={data}
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

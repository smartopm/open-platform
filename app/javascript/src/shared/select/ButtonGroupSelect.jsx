import React from 'react'
import {
  MenuItem,
  TextField,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';

export default function ButtonGroupSelect({
  options,
  selectedOption,
  setSelectedOption ,
  handleSelectOption
}){
  const { t } = useTranslation('task')

  function handleMenuItemClick(_event, key) {
    setSelectedOption(key);
    handleSelectOption(key)
  }

  return (
    <>
      <TextField
        select
        labelId="select-task-status"
        id="select-task-status"
        data-testid="select-task-status"
        value={selectedOption}
        label={t('misc.select')}
        fullWidth
      >
        {Object.entries(options).map(([key, val]) => (
          <MenuItem
            key={key}
            selected={key === selectedOption}
            onClick={(event) => handleMenuItemClick(event, key)}
            value={key}
          >
            {val}
          </MenuItem>
            ))}
      </TextField>
    </>
  )
}

ButtonGroupSelect.propTypes = {
  options: PropTypes.shape.isRequired,
  selectedOption: PropTypes.string.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  handleSelectOption: PropTypes.func.isRequired
}

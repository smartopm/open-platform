import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IconButton, TextField, Typography, Grid, Button } from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import { useTranslation } from 'react-i18next';
import { objectAccessor } from '../../../utils/helpers';

/**
 *
 * @param {@description} this is for form fields that require separate inputs of same type
 * eg:
 * @example Phone Number => Phone Number 1, Phone Number 2
 */
export default function FormOptionInput({ options, setOptions, label }) {
  const { t } = useTranslation('common');
  const matches = useMediaQuery('(max-width:900px)');
  function handleOptionChange(event, index) {
    const values = options;
    values[parseInt(index, 10)] = event.target.value;
    setOptions([...values]);
  }

  function handleAddOption() {
    setOptions([...options, '']);
  }

  function handleRemoveOption(index) {
    const values = options;
    values.splice(index, 1);
    setOptions([...values]);
  }
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={matches ? { padding: '0 15px' } : { padding: '0 20px' }}
    >
      <Grid item md={8} xs={12}>
        {options.map((value, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid container key={i} alignItems="center" justifyContent="center">
            <Grid item md={9} xs={8}>
              {label === t('form_fields.secondary_number') ? (
                <>
                  <label
                    htmlFor="phoneNumber"
                    className="MuiFormLabel-root MuiInputLabel-shrink
              MuiInputLabel-root"
                  >
                    {t('form_fields.secondary_number')}
                    {i}
                    <span
                      aria-hidden="true"
                      className="MuiFormLabel-asterisk MuiInputLabel-asterisk"
                    >
                      &nbsp;*
                    </span>
                  </label>
                  <PhoneInput
                    value={objectAccessor(options, i)?.info}
                    enableSearch
                    inputProps={{
                      name: 'phoneNumber',
                      required: true
                    }}
                    placeholder={t('form_placeholders.phone_number')}
                    onChange={val => {
                      const values = options;
                      values[parseInt(i, 10)] = val;
                      setOptions([...options]);
                    }}
                    preferredCountries={['hn', 'zm', 'ng', 'in', 'us']}
                    containerStyle={{
                      width: '30%',
                      display: 'inline-block',
                      marginRight: '5px'
                    }}
                  />
                </>
              ) : (
                <TextField
                  label={`${label} ${i}`}
                  variant="outlined"
                  size="small"
                  className={`form-property-field-type-option-txt-input-${i}`}
                  value={objectAccessor(options, i)?.info || value}
                  onChange={event => handleOptionChange(event, i)}
                  autoFocus={process.env.NODE_ENV !== 'test'}
                  required
                />
              )}
            </Grid>
            <Grid item md={3} xs={4}>
              <IconButton onClick={() => handleRemoveOption(i)} aria-label="remove" size="large">
                <DeleteOutline />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item md={4} xs={12}>
        <Button
          onClick={handleAddOption}
          aria-label="add"
          style={{ marginLeft: -15 }}
          className="form-property-field-type-option-add-btn"
          size="large"
          color="primary"
        >
          <AddCircleOutline />
          <Typography
            color="primary"
            variant="caption"
            style={{ marginLeft: 10 }}
            data-testid="add_type"
          >
            {t('form_actions.add_type', { label })}
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
}

export function FormOptionWithOwnActions({ actions, options }) {
  const { t } = useTranslation('common');
  return options.map((option, index) => (
    <div key={option.id}>
      <TextField
        label={t('misc.option_with_count', { id: index + 1 })}
        variant="outlined"
        size="small"
        defaultValue={option.info}
        onChange={e => actions.handleOptionChange(e, index)}
        margin="normal"
        autoFocus={process.env.NODE_ENV !== 'test'}
        required
        style={{ width: 300 }}
        data-testid="option-text-field"
      />
      <IconButton
        style={{ marginTop: 13 }}
        onClick={() => actions.handleRemoveOption(index)}
        aria-label="remove"
        size="large"
        data-testid="remove-option-btn"
      >
        <DeleteOutline />
      </IconButton>
    </div>
  ));
}

FormOptionInput.propTypes = {
  /**
   * an array of string, that show different option fields
   */
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * a function that updates the options, it gets the given value and updates the array
   * at a correct index
   */
  setOptions: PropTypes.func.isRequired,
  /**
   * Description of a field being updated
   */
  label: PropTypes.string.isRequired
};

FormOptionWithOwnActions.propTypes = {
  actions: PropTypes.shape({
    handleRemoveOption: PropTypes.func,
    handleOptionChange: PropTypes.func
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.object)
};

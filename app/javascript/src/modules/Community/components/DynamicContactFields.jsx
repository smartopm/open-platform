import React from 'react'
import { IconButton, MenuItem, TextField } from '@mui/material'
import { DeleteOutline } from '@mui/icons-material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { objectAccessor } from '../../../utils/helpers'

export default function DynamicContactFields({
  options,
  handleChange,
  handleRemoveRow,
  data,
  hasSocialLink,
}) {
  const classes = useStyles()
  const { t } = useTranslation('common')

  return options.map((val, i) => (
    <div
      className={classes.textField}
      // eslint-disable-next-line react/no-array-index-key
      key={i}
    >
      <TextField
        id={`${i}-${data.label}-value-input`}
        style={{ width: '300px'}}
        label={data.label}
        onChange={event => handleChange(event, i)}
        value={objectAccessor(options[parseInt(i, 10)], data.name)}
        name={data.name}
        data-testid='text_field'
      />
      {hasSocialLink ? (
        <TextField
          id={`${i}-select-category`}
          style={{ width: '200px', marginLeft: '40px' }}
          select
          label={t('misc.select_category')}
          value={val.category}
          onChange={event => handleChange(event, i)}
          name="category"
        >
          <MenuItem value="facebook">{t('misc.facebook')}</MenuItem>
          <MenuItem value="twitter">{t('misc.twitter')}</MenuItem>
          <MenuItem value="website">{t('misc.website')}</MenuItem>
        </TextField>
        ) : (
          <TextField
            id={`${i}-select-category`}
            style={{ width: '200px', marginLeft: '40px' }}
            select
            label={t('misc.select_category')}
            value={val.category}
            onChange={event => handleChange(event, i)}
            name="category"
          >
            <MenuItem value="sales">{t('misc.sales')}</MenuItem>
            <MenuItem value="customer_care">{t('misc.customer_care')}</MenuItem>
            <MenuItem value="bank">{t('misc.bank')}</MenuItem>
          </TextField>
      )}
      <IconButton
        style={{ marginTop: 13 }}
        onClick={() => handleRemoveRow(i)}
        aria-label="remove"
        size="large"
      >
        <DeleteOutline />
      </IconButton>
    </div>
  ));
}

DynamicContactFields.defaultProps ={
  hasSocialLink: false,
}

DynamicContactFields.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemoveRow: PropTypes.func.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string
  }),
  hasSocialLink: PropTypes.bool,
}

const useStyles = makeStyles({
  textField: {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0'
  }
})

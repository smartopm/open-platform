import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TextPreview from './TextPreview';

export default function TermsAndCondition({ handleCheckTerms, categoriesData, isChecked }) {
  const { t } = useTranslation('form');
  return (
    <TextPreview categoriesData={categoriesData}>
      <FormControlLabel
        control={(
          <Checkbox 
            color="primary"
            checked={isChecked}
            onChange={event => handleCheckTerms(event.target.checked)}
            required
          />
        )}
        label={t('actions.i_agree')}
      />
    </TextPreview>
  );
}

TermsAndCondition.defaultProps = {
    handleCheckTerms: () => {},
    isChecked: false,
}
TermsAndCondition.propTypes = {
  handleCheckTerms: PropTypes.func,
  isChecked: PropTypes.bool,
  categoriesData: PropTypes.arrayOf(
    PropTypes.shape({
      renderedText: PropTypes.string
    })
  ).isRequired
};

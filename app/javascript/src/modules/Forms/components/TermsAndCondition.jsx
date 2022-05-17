import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TextPreview from './TextPreview';

export default function TermsAndCondition({ handleCheckTerms, categoriesData, hasAgreedToTerms }) {
  const { t } = useTranslation('form');
  return (
    <TextPreview categoriesData={categoriesData}>
      <FormControlLabel
        control={
          <Checkbox color="primary" checked={hasAgreedToTerms} onChange={handleCheckTerms} required />
          }
        label={t('actions.i_agree')}
      />
    </TextPreview>
  );
}

TermsAndCondition.propTypes = {
  handleCheckTerms: PropTypes.func.isRequired,
  hasAgreedToTerms: PropTypes.bool.isRequired,
  categoriesData: PropTypes.shape({
    data: PropTypes.shape({
      formCategories: PropTypes.arrayOf(
        PropTypes.shape({
          renderedText: PropTypes.string
        })
      )
    })
  }).isRequired
};

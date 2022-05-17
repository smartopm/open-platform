import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import TextPreview from './TextPreview';

export default function FormPreview({ loading, handleFormSubmit, categoriesData}) {
  const { t } = useTranslation('form')
  return (
    <TextPreview categoriesData={categoriesData}>
      <CenteredContent>
        <Button
          variant="outlined"
          type="submit"
          color="primary"
          onClick={handleFormSubmit}
          disabled={loading}
          startIcon={loading && <Spinner />}
          data-testid="confirm_contract"
        >
          {t('actions.confirm')}
        </Button>
      </CenteredContent>
    </TextPreview>
  );
}

FormPreview.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
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

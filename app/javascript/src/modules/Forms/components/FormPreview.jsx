import { Button, Container } from '@mui/material';
import React, { useContext } from 'react';
import ReactMarkDown from 'react-markdown';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CenteredContent from '../../../components/CenteredContent';
import { Spinner } from '../../../shared/Loading';
import { parseRenderedText } from '../utils';
import { FormContext } from '../Context';

export default function FormPreview({ loading, handleFormSubmit, categoriesData }) {
  const { t } = useTranslation('form')
  const { formProperties } = useContext(FormContext)
  const markdown = parseRenderedText(categoriesData.data?.formCategories, formProperties)
  return (
    <Container>
      <ReactMarkDown 
        // eslint-disable-next-line react/no-children-prop
        children={markdown}
      />
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
    </Container>
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

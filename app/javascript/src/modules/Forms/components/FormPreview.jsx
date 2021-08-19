import { Button, Container } from '@material-ui/core';
import React from 'react';
import ReactMarkDown from 'react-markdown';
import PropTypes from 'prop-types';
import CenteredContent from '../../../components/CenteredContent';
import { Spinner } from '../../../shared/Loading';

export default function FormPreview({ loading, handleFormSubmit, categoriesData }) {
  const markdown = categoriesData.data.formCategories.map(category => `${category.renderedText}  `).join('');
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
        >
          Confirm
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
          id: PropTypes.string.isRequired,
          fieldName: PropTypes.string.isRequired,
          renderedText: PropTypes.string.isRequired
        })
      )
    })
  }).isRequired
};


import { Container } from '@mui/material';
import React, { useContext } from 'react';
import ReactMarkDown from 'react-markdown';
import PropTypes from 'prop-types';
import { parseRenderedText } from '../utils';
import { FormContext } from '../Context';

export default function TextPreview({ children, categoriesData }) {
  const { formProperties } = useContext(FormContext)
  const markdown = parseRenderedText(categoriesData, formProperties)
  return (
    <Container>
      <ReactMarkDown 
        // eslint-disable-next-line react/no-children-prop
        children={markdown}
      />
      {children}
    </Container>
  );
}

TextPreview.propTypes = {
  children: PropTypes.node.isRequired,
  categoriesData: PropTypes.arrayOf(
    PropTypes.shape({
      renderedText: PropTypes.string
    })
  ).isRequired
};


import React, { useContext } from 'react';
import { Container } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ReactMarkDown from 'react-markdown';
import PropTypes from 'prop-types';
import { parseRenderedText } from '../utils';
import { FormContext } from '../Context';

export default function TextPreview({ children, categoriesData }) {
  const { formProperties } = useContext(FormContext)
  const markdown = parseRenderedText(categoriesData, formProperties)
  const classes = useStyles()
  return (
    <Container>
      <div className={classes.termsWrapper}>
        <ReactMarkDown 
        // eslint-disable-next-line react/no-children-prop
          children={markdown}
        />
      </div>
      <br />
      {children}
    </Container>
  );
}

const useStyles = makeStyles(() => ({
  termsWrapper: {
    border: '2px solid #c4c4c4',
    overflowY: 'scroll',
    borderRadius: 4,
    padding: 16,
    height: 200
  }
}))

TextPreview.defaultProps = {
  categoriesData: []
}

TextPreview.propTypes = {
  children: PropTypes.node.isRequired,
  categoriesData: PropTypes.arrayOf(
    PropTypes.shape({
      renderedText: PropTypes.string
    })
  )
};

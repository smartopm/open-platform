import React from 'react'
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

export default function IconWithLabel({ children, data, isLabel, testId }) {
  const classes = useStyles();
  return (
    <>
      {children}
      {isLabel === true && (
        <Container disableGutters className={classes.label}>
          <span
            data-testid={testId}
            style={{ color: `${data > 0 ? 'inherit' : '#000'}` }}
          >
            {data}
          </span>
        </Container>
      )}
    </>
  );
}


IconWithLabel.defaultProps = {
  isLabel: false,
  testId: 'icon-label',
  data: 0
};

IconWithLabel.propTypes = {
  children: PropTypes.node.isRequired,
  isLabel: PropTypes.bool,
  testId: PropTypes.string,
  data: PropTypes.number
};

const useStyles = makeStyles({
  label: {
    martinLeft: '5px',
    fontSize: '12px'
  }
});
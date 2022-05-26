import React from 'react'
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

export default function IconWithLabel({
  Icon, iconFontSize, iconColor, data, label, testId
}) {
  const classes = useStyles();
  return (
    <>
      <Icon fontSize={iconFontSize} color={iconColor} />
      {label === true && (
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
  iconFontSize: '14px',
  label: false,
  testId: 'icon-label',
  data: 0
};

IconWithLabel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  Icon: PropTypes.object.isRequired,
  iconFontSize: PropTypes.string,
  iconColor: PropTypes.string.isRequired,
  label: PropTypes.bool,
  testId: PropTypes.string,
  data: PropTypes.number
};

const useStyles = makeStyles({
  label: {
    martinLeft: '5px',
    fontSize: '12px'
  }
});
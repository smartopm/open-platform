import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CenteredContent from './CenteredContent';

export default function CardWrapper({ children, title, buttonName, displayButton, handleButton }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h6" style={{ marginBottom: '20px' }}>
        {title}
      </Typography>
      {children}
      {displayButton && (
        <CenteredContent>
          <div style={{ marginTop: '20px' }}>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={handleButton}
            >
              {buttonName}
            </Button>
          </div>
        </CenteredContent>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: '20px',
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: '5px',
    background: '#FBFBFA'
  }
}));

CardWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  displayButton: PropTypes.bool.isRequired,
  handleButton: PropTypes.func.isRequired
};
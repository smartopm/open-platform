import React from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

// TODO: match file name with the component name
export default function CardComponent({
  children,
  clickData,
  styles,
  contentStyles,
  primaryColor,
  className
}) {
  const classes = useStyles(primaryColor)();
  return (
    <>
      <Card
        elevation={0}
        className={`${clickData?.clickable ? classes.cardClickable : classes.card} ${className}`}
        onClick={clickData?.clickable ? e => clickData?.handleClick(e) : null}
        style={styles}
        variant="outlined"
        data-testid="card"
      >
        <CardContent style={contentStyles}>{children}</CardContent>
      </Card>
    </>
  );
}

const useStyles = primaryColor =>
  makeStyles(theme => ({
    card: {
      marginBottom: '10px',
      borderColor: primaryColor ? theme.palette.primary.main : undefined
    },
    cardClickable: {
      marginBottom: '10px',
      cursor: 'pointer',
      borderColor: primaryColor ? theme.palette.primary.main : undefined
    }
  }));

CardComponent.defaultProps = {
  clickData: {
    clickable: false,
    handleClick: () => {}
  },
  styles: {},
  contentStyles: { padding: '10px' },
  primaryColor: false,
  className: {}
};

CardComponent.propTypes = {
  children: PropTypes.node.isRequired,
  clickData: PropTypes.shape({
    clickable: PropTypes.bool,
    handleClick: PropTypes.func
  }),
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  contentStyles: PropTypes.object,
  primaryColor: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  className: PropTypes.object
};

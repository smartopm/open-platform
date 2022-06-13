import React from 'react';
import Card from '@mui/material/Card';
import PropTypes from 'prop-types';
import CardContent from '@mui/material/CardContent';
import makeStyles from '@mui/styles/makeStyles';

// TODO: match file name with the component name
export default function CardComponent({
  children,
  clickData,
  styles,
  contentStyles,
  primaryColor,
  className,
  lateCard
}) {
  const classes = useStyles(primaryColor)();
  return (
    <>
      <Card
        elevation={0}
        className={`${lateCard ? classes.lateCard : ''} ${clickData?.clickable ? classes.cardClickable : classes.card} ${className}`}
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
    },
    lateCard: {
      borderLeft: '5px solid #D15249'
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
  className: {},
  lateCard: false
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
  className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  lateCard: PropTypes.bool
};

import React from 'react'
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

export default function CardComponent({ children, clickData }) {
  const classes = useStyles();
  return (
    <>
      <Card
        elevation={0}
        className={clickData?.clickable ? classes.cardClickable : classes.card}
        onClick={clickData?.clickable ? () =>  clickData?.handleClick() : null}
        variant='outlined'
        data-testid='card'
      >
        <CardContent style={{padding: '10px'}}>
          {children}
        </CardContent>
      </Card>
    </>
  )
}

const useStyles = makeStyles(() => ({ 
  card: {
    marginBottom: '10px'
  },
  cardClickable: { 
    marginBottom: '10px',
    cursor: "pointer"
  }
}))

CardComponent.defaultProps = {
  clickData: {
    clickable: false,
    handleClick: () => {}
  }
}

CardComponent.propTypes = {
  children: PropTypes.node.isRequired,
  clickData: PropTypes.shape({
    clickable: PropTypes.bool,
    handleClick: PropTypes.func
  })
};
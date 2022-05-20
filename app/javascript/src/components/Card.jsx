import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { Card, CardContent, Grid, Typography } from '@mui/material';

export default function HomePageCard({
  title,
  path,
  from,
  clientName,
  clientNumber,
  children,
  id,
  access,
  authState
}) {
  const classes = useStyles();

  if (
    !access.includes(authState.user.userType.toLowerCase()) ||
    (id === 10 && authState.user.community.name !== 'Nkwashi') ||
    (id === 14 && authState.user.community.name === 'Ciudad Morazán')
  ) {
    return null;
  }

  return (
    <Grid item xs={6} md={4}>
      {children ? (
        <Card variant="outlined" elevation={0} className={classes.card}>
          <CardContent className={classes.cardContent}>{children}</CardContent>
        </Card>
      ) : (
        <Link
          to={{
            pathname: path,
            state: {
              clientName,
              clientNumber,
              from
            }
          }}
          id={id}
          className={classes.cardLink}
        >
          <Card variant="outlined" elevation={0} className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography color="textSecondary" className={classes.root} data-testid="link-name">
                {title}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      )}
    </Grid>
  );
}

HomePageCard.defaultProps = {
  children: null,
  from: '',
  clientName: '',
  clientNumber: '',
  id: '',
  title: '',
  path: null
};

HomePageCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  path: PropTypes.string,
  from: PropTypes.string,
  clientName: PropTypes.string,
  clientNumber: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  access: PropTypes.arrayOf(PropTypes.string).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '0.9em',
    fontWeight: 400,
    lineHeight: 1.5,
    color: theme.palette.primary.main
  },
  card: {
    minHeight: '9em',
    border: `1px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& $root': {
        color: '#FFFFFF'
      }
    }
  },
  cardContent: {
    textAlign: 'center',
    paddingTop: '3.5em',
    textOverflow: 'ellipsis'
  },
  cardLink: {
    textDecorationLine: 'none',
    '&:hover': {
      textDecorationLine: 'none'
    }
  }
}));

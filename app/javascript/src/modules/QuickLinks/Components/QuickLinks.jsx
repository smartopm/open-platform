import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';

export default function QuickLinks({ menuItems, translate }) {
  const matches = useMediaQuery('(max-width:600px)');
  const classes = useStyles();
  /*
    When menu items are deleted in community settings,
    we we still have the community.menu_items field populated like
    so: [{"menu_link"=>"", "menu_name"=>""}].
    We need to fix this in future so that we have a truly empty array
  */
  if (!menuItems || (menuItems && menuItems.filter(item => item.menu_link !== '').length === 0)) {
    return <div />;
  }
  return (
    <>
      <div>
        {matches ? (
          <div style={{ marginTop: '20px' }}>
            <Typography className={classes.mobile} data-testid="link-title-mobile">
              {translate('dashboard.quick_links')}
            </Typography>
          </div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <Grid container alignItems="center">
              <Typography
                className={classes.bold}
                data-testid="link-title"
              >
                {translate('dashboard.quick_links')}
              </Typography>
            </Grid>
          </div>
        )}
        <Grid
          container
          spacing={2}
          style={matches ? { padding: '20px 0' } : { padding: '20px 0' }}
        >
          {menuItems.map(item => (
            <Grid item xs={6} sm={3} key={item.menu_link}>
              <Link href={item.menu_link} className={classes.quickLink}>
                <Card variant="outlined" elevation={0} className={classes.card}>
                  <CardContent className={classes.card_content}>
                    <Typography
                      color="textSecondary"
                      className={classes.root}
                      data-testid="link-name"
                    >
                      {item.menu_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '0.9em',
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#FFFFFF'
  },
  card: {
    minHeight: '9em',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  card_content: {
    textAlign: 'center',
    paddingTop: '3.5em',
    textOverflow: 'ellipsis'
  },
  icon: {
    color: '#66A59A'
  },
  icon_border: {
    backgroundColor: '#EDF4F3',
    width: '1.5em',
    height: '1.5em',
    marginBottom: '0.2em'
  },
  bold: {
    fontSize: '22px',
    fontWeight: 500,
    color: '#141414'
  },
  mobile: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#141414'
  },
  quickLink: {
    '&:hover': {
      textDecorationLine: 'none'
    }
  }
}));

QuickLinks.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      menu_name: PropTypes.string,
      menu_link: PropTypes.string
    })
  ).isRequired,
  translate: PropTypes.func.isRequired
};

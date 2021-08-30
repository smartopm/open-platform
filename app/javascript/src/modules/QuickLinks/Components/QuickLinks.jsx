import React from 'react';
import { Card, CardContent, Grid, IconButton, Typography } from '@material-ui/core'
import Link from '@material-ui/core/Link';
import LinkIcon from '@material-ui/icons/Link';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

export default function QuickLinks({ menuItems, translate }) {
  const matches = useMediaQuery('(max-width:600px)');
  const classes = useStyles();
  /*
    When menu items are deleted in community settings,
    we we still have the community.menu_items field populated like so: [{"menu_link"=>"", "menu_name"=>""}].
    We need to fix this in future so that we have a truly empty array
  */
  if (menuItems && menuItems.filter(item => item.menu_link !== "").length === 0) {
    return <div />
  }
  return (
    <>
      <div>
        {
          matches ? (
            <div style={{margin: '20px 20px 0 20px', display: 'flex'}}>
              <Typography className={classes.mobile} data-testid='link-title-mobile'>
                {translate('dashboard.quick_links')}
              </Typography>
            </div>
          ) : (
            <div style={{marginLeft: '79px', marginTop: '20px'}}>
              <Grid container alignItems="center">
                <Typography
                  className={classes.bold}
                  style={{marginRight: '20px'}}
                  data-testid='link-title'
                >
                  {translate('dashboard.quick_links')}
                </Typography>
              </Grid>
            </div>
          )
        }
        <Grid container spacing={2} style={matches ? {padding: '20px'} : {padding: '20px 57px 20px 79px', width: '99%'}}>
          {
              menuItems.map((item) => (
                <Grid item xs={6} sm={3} key={item.menu_link}>
                  <Link href={item.menu_link}>
                    <Card variant="outlined" elevation={0} className={classes.card}>
                      <CardContent className={classes.card_content}>
                        <IconButton aria-label="link" className={classes.icon_border} data-testid='link-button'>
                          <LinkIcon className={classes.icon} />
                        </IconButton>
                        <Typography color="textSecondary" className={classes.root} data-testid='link-name'>
                          { item.menu_name }
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
                )
              )
            }
        </Grid>
      </div>
    </>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    fontSize: '0.9em',
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#575757'
  },
  card: {
    minHeight: '9em'
  },
  card_content: {
    textAlign: 'center',
    paddingTop: '2em',
    textOverflow: 'ellipsis'
  },
  icon: {
    color: '#66A59A',
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
  }
}));

QuickLinks.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    menu_name: PropTypes.string,
    menu_link: PropTypes.string,
  })).isRequired,
  translate: PropTypes.func.isRequired
};

/* eslint-disable react/prop-types */
import React from 'react'
import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import PropTypes from 'prop-types'
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { sanitizeText, truncateString } from '../../../utils/helpers'

export default function PostItem({
  title, imageUrl, datePosted, subTitle
}) {
  // eslint-disable-next-line no-use-before-define
  const classes = useStyles();
  const { t } = useTranslation('news')
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={(
          <Avatar aria-label="header" className={classes.avatar}>
            {title.charAt(0)}
          </Avatar>
          )}
        title={(
          <span
            data-testid="post_title"
              // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: sanitizeText(title)
            }}
          />
            )}
        subheader={datePosted}
      />
      <CardMedia className={classes.media} image={imageUrl} title={title} />
      <CardContent>
        <Typography variant="body2" color="textPrimary" component="h2">
          <div
              // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: sanitizeText(truncateString(subTitle, 100))
            }}
          />
        </Typography>
      </CardContent>
      <CardActions>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: 30,
            justifyContent: 'flex-end',
            width: '100%'
          }}
        >
          <Typography color="textSecondary" component="p">
            {t('news.read_more')}
          </Typography>
          <ChevronRightIcon />
        </Box>
      </CardActions>
    </Card>
  )
}

PostItem.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  datePosted: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
}

// Moved this at the bottom
const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 400,
    cursor: 'pointer',
    margin: 10,
    shadowColor: '#CCE5F3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6
  },
  media: {
    height: 0,
    width: 400,
    paddingTop: '56.25%', // 16:9,
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

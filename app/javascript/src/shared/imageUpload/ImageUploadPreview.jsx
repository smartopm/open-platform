import React from 'react'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ImageAuth from '../ImageAuth';

export default function ImageUploadPreview({ imageUrls, token, sm, xs, style, imgHeight }) {
  const classes = useStyles();
  return (
    <>
      <Grid container>
        {imageUrls.map((img) => (
          <Grid item sm={sm} xs={xs} key={img} style={style} className={classes.grid} data-testid='upload_preview'>
            <IconButton className={classes.iconButton}>
              <CloseIcon className={classes.closeButton} />
            </IconButton>
            <ImageAuth
              imageLink={img}
              token={token}
              style={{height: imgHeight}}
            />
          </Grid>
      ))}
      </Grid>
    </>
  )
}

const useStyles = makeStyles(() => ({ 
  grid: {
    position: 'relative'
  },
  iconButton: {
    right: 2, 
    marginRight: 5, 
    position: 'absolute'
  },
  closeButton: {
    height: '30px'
  }
}))

ImageUploadPreview.defaultProps = {
  style: {},
  sm: 12,
  xs: 12,
  imgHeight: 300
}

ImageUploadPreview.propTypes = {
  token: PropTypes.string.isRequired,
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  sm: PropTypes.number,
  xs: PropTypes.number,
  imgHeight: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object
};
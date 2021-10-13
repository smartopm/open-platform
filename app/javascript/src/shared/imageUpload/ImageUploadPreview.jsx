import React from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import ImageAuth from '../ImageAuth';

export default function ImageUploadPreview({ imageUrls, token, sm, xs, style, imgHeight }) {
  return (
    <>
      <Grid container>
        {imageUrls.map((img) => (
          <Grid item sm={sm} xs={xs} key={img} style={style} data-testid='upload_preview'>
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
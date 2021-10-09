import React from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import ImageAuth from '../ImageAuth';

export default function ImageUploadPreview({ imageUrls, token, sm, xs, style }) {
  return (
    <>
      <Grid container>
        {imageUrls.map((img) => (
          <Grid item sm={sm} xs={xs} key={img} style={style}>
            <ImageAuth
              imageLink={img}
              token={token}
              className="img-responsive img-thumbnail"
            />
          </Grid>
      ))}
      </Grid>
    </>
  )
}

ImageUploadPreview.defaultProps = {
  style: {}
}

ImageUploadPreview.propTypes = {
  token: PropTypes.string.isRequired,
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  sm: PropTypes.number.isRequired,
  xs: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object
};
import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ImageAuth from '../ImageAuth';

export default function ImageUploadPreview({
  imageUrls,
  sm,
  xs,
  style,
  imgHeight,
  imgWidth,
  closeButtonData
}) {
  const classes = useStyles();
  return (
    <>
      <Grid container>
        {imageUrls.map(img => (
          <Grid
            item
            sm={sm}
            xs={xs}
            key={img}
            style={style}
            className={classes.grid}
            data-testid="upload_preview"
          >
            {closeButtonData.closeButton && (
              <IconButton
                className={classes.iconButton}
                onClick={() => closeButtonData.handleCloseButton(img)}
                data-testid="image_close"
              >
                <CloseIcon className={classes.closeButton} />
              </IconButton>
            )}
            <ImageAuth
              imageLink={img}
              style={{ height: imgHeight, width: imgWidth }}
              className="img-responsive img-thumbnail"
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
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
    height: '40px',
    width: '40px'
  }
}));

ImageUploadPreview.defaultProps = {
  style: {},
  sm: 12,
  xs: 12,
  imgHeight: '300px',
  imgWidth: '100%',
  closeButtonData: {
    closeButton: false,
    handleCloseButton: () => {}
  }
};

ImageUploadPreview.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  sm: PropTypes.number,
  xs: PropTypes.number,
  imgHeight: PropTypes.string,
  imgWidth: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  closeButtonData: PropTypes.shape({
    closeButton: PropTypes.bool,
    handleCloseButton: PropTypes.func
  })
};

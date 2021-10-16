import React from 'react';
import { Grid, makeStyles, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import AddIcon from '@material-ui/icons/Add';
import ImageUploadPreview from './ImageUploadPreview';
import ImageUploader from './ImageUploader';
import CenteredContent from '../../components/CenteredContent';

export default function ImageArea({ handleClick, handleChange, imageUrl, token, type }) {
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} className={classes.imageGrid} data-testid="image_area">
      <Paper elevation={0} className={classes.imageArea} style={{ height: '300px' }}>
        <Grid container alignItems="center" justify="center" direction="row">
          {imageUrl && (
            <ImageUploadPreview
              imageUrls={[imageUrl]}
              token={token}
              imgHeight={250}
              style={{ textAlign: 'center' }}
            />
          )}
          {!imageUrl && <Grid style={{ height: 250 }} />}

          <Grid item xs={12} onClick={handleClick} style={{ textAlign: 'center' }}>
            <Grid container alignItems="center">
              {!imageUrl && (
                <Grid item xs={12} style={{ textAlign: 'right', paddingTop: '8px' }}>
                  <CenteredContent>
                    <Skeleton animation={false} variant="rect" width={320} height={200} />
                  </CenteredContent>
                </Grid>
              )}
              <Grid item xs={12}>
                <CenteredContent>
                  <ImageUploader
                    icon={<AddIcon />}
                    handleChange={handleChange}
                    useDefaultIcon
                    buttonText={type}
                  />
                </CenteredContent>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  imageArea: {
    border: '1px dotted #D0D0D0'
  },
  imageGrid: {
    padding: '20px 30px'
  }
}));

ImageArea.propTypes = {
  handleClick: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

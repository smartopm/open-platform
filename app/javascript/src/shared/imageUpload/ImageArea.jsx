import React from 'react';
import { Grid, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import AddIcon from '@mui/icons-material/Add';
import ImageUploadPreview from './ImageUploadPreview';
import ImageUploader from './ImageUploader';
import CenteredContent from '../../components/CenteredContent';

export default function ImageArea({ handleClick, handleChange, imageUrl, type }) {
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} className={classes.imageGrid} data-testid="image_area">
      <Paper elevation={0} className={classes.imageArea} style={{ height: '300px' }}>
        <Grid container alignItems="center" justifyContent="center" direction="row">
          {imageUrl && (
            <ImageUploadPreview
              imageUrls={[imageUrl]}
              imgHeight='250px'
              imgWidth='60%'
              style={{ textAlign: 'center' }}
            />
          )}
          {!imageUrl && <Grid data-testid="empty_grid" style={{ height: 250 }} />}

          <Grid item xs={12} onClick={handleClick} style={{ textAlign: 'center' }}>
            <Grid container alignItems="center">
              {!imageUrl && (
                <Grid item xs={12} style={{ textAlign: 'right', paddingTop: '8px' }} data-testid="skeleton_section">
                  <CenteredContent>
                    <Skeleton animation={false} variant="rectangular" width={320} height={200} />
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

ImageArea.defaultProps = {
  imageUrl: null
}

ImageArea.propTypes = {
  handleClick: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  type: PropTypes.string.isRequired
};

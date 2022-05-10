import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { sanitizeText, truncateString } from '../utils/helpers';

export default function ControlledCard({ subtitle, imageUrl }) {
  return (
    <Card sx={{ display: 'flex' }} elevation={0} style={{border: '1px solid #DDDDDD',  height: '100px', borderRadius: '7px' }}>
      <CardMedia
        component="img"
        sx={{ width: '50%' }}
        image={imageUrl}
        alt={imageUrl}
        data-testid='image'
      />
      <Box>
        <CardContent>
          <Typography variant="body2" color="text.secondary" component='div' data-testid='content'>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: sanitizeText(truncateString(subtitle, 50))
              }}
            />
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

ControlledCard.propTypes = {
  subtitle: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
};

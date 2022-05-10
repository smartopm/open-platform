import React from 'react';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { sanitizeText, truncateString } from '../utils/helpers';

export default function MediaCard({ title, subtitle, imageUrl }) {
  return (
    <Card elevation={0} style={{ border: '1px solid #DDDDDD', borderRadius: '7px' }}>
      <CardContent>
        <Typography gutterBottom variant="body2" component="div">
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" data-testid="subtitle" component='div'>
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: sanitizeText(truncateString(subtitle, 50))
            }}
          />
        </Typography>
      </CardContent>
      <CardMedia component="img" height="140" image={imageUrl} alt={title} data-testid="image" />
    </Card>
  );
}

MediaCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
};

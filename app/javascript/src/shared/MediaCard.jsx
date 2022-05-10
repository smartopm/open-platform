import React from 'react';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { sanitizeText, truncateString } from '../utils/helpers';

export default function MediaCard({ title, subtitle, imageUrl }) {
  return (
    <Card elevation={0} style={{border: '1px solid #DDDDDD'}}>
      <CardContent>
        <Typography gutterBottom variant="body1" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Typography variant="body2" color="text.secondary">
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: sanitizeText(truncateString(subtitle, 50))
              }}
            />
          </Typography>
        </Typography>
      </CardContent>
      <CardMedia component="img" height="140" image={imageUrl} alt={title} />
    </Card>
  );
}

MediaCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
};

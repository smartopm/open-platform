import React from 'react';
import { Typography, Container } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function PostContent({ response }) {
  return (
    <Container>
      <br />
      <Typography align="center" variant="h3" color="textSecondary">
        <strong>{response.title}</strong>
      </Typography>
      <br />
      <img className="img-fluid" src={response.post_thumbnail?.URL} alt="" />
      <div
        className="wp_content container"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: response.content }}
      />
    </Container>
  );
}

PostContent.propTypes = {
  response: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    post_thumbnail: PropTypes.object,
    title: PropTypes.string,
    content: PropTypes.string
  }).isRequired
};

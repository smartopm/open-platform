// The file should be moved to shared directory

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ImageAuth from "../ImageAuth";


describe('ImageAuth Component', () => {
  it('should render image or text', async () => {
    const props = {
      imageLink: 'http://image.url',
      auth: false
    };
    const container = render(<ImageAuth {...props} />);

    await waitFor(() => {
      expect(container.queryByTestId('authenticated_image')).toBeInTheDocument();
    }, 10);
  });
  it('should render file', async () => {
    const props = {
      imageLink: 'http://image.url',
      auth: false,
      type: 'some_file'
    };
    const container = render(<ImageAuth {...props} />);

    await waitFor(() => {
      expect(container.queryByTestId('authenticated_file')).toBeInTheDocument();
    }, 10);
  });
  it('should render default image', async () => {
    const props = {
      imageLink: 'null',
      auth: true,
      type: 'nomatter'
    };
    const container = render(<ImageAuth {...props} />);

    await waitFor(() => {
      expect(container.queryByTestId('default_image')).toBeInTheDocument();
    }, 10);
  });
  it('should render imageAvatar', async () => {
    const props = {
      imageLink: 'http://image.url',
      auth: false,
      type: 'imageAvatar'
    };
    const container = render(<ImageAuth {...props} />);

    await waitFor(() => {
      expect(container.queryByTestId('authenticated_avatar')).toBeInTheDocument();
    }, 10);
  })
});


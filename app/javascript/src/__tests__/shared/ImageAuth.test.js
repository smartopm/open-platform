// The file should be moved to shared directory

import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import ImageAuth from '../../shared/ImageAuth';
import '@testing-library/jest-dom/extend-expect';

describe('ImageAuth Component', () => {
  it('should render image or text', async () => {
    const props = {
      imageLink: 'http://image.url',
      auth: true
    };
    let container;
    await act(async () => {
      container = render(<ImageAuth {...props} />);
    });

    await waitFor(() => {
      expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument();
    }, 10)
  });
});

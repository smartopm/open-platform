// The file should be moved to shared directory

import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import ImageAuth from '../../shared/ImageAuth';
import '@testing-library/jest-dom/extend-expect';
import { Spinner } from '../../shared/Loading';

describe('ImageAuth Component', () => {
  it('should render image or text', async () => {
    const props = {
      imageLink: 'http://image.url',
    };
    await act(async () => {
      render(<ImageAuth {...props} />);
    });
    const loader = render(<Spinner />);

    await waitFor(() => {
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    }, 10)
  });
});

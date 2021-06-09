// The file should be moved to shared directory

import React from 'react';
import { act, render } from '@testing-library/react';
import ImageAuth from '../../shared/ImageAuth';
import '@testing-library/jest-dom/extend-expect';
import { Spinner } from '../../shared/Loading';

describe('ImageAuth Component', () => {
  it('should render image or text', async () => {
    const props = {
      imageLink: 'http://image.url',
      token: '9234jsdnfsjd2-232ds'
    };
    await act(async () => {
      render(<ImageAuth {...props} />);
    });
    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
  });
});

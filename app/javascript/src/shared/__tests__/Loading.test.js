import React from 'react';
import { render } from '@testing-library/react';

import { Spinner, LinearSpinner } from "../Loading";

describe('Loading', () => {
  it('renders Spinner component', async () => {
    const container = render(
      <Spinner />
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });

  it('renders LinearSpinner component', async () => {
    const container = render(
      <LinearSpinner />
    );

    expect(container.queryByTestId('linear-loader')).toBeInTheDocument();
  });
});
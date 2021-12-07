import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { Spinner, LinearSpinner } from "../Loading";

describe('Loading', () => {
  it('renders Spinner component', async () => {
    const container = render(
      <BrowserRouter>
        <Spinner />
      </BrowserRouter>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });

  it('renders LinearSpinner component', async () => {
    const container = render(
      <BrowserRouter>
        <LinearSpinner />
      </BrowserRouter>
    );

    expect(container.queryByTestId('linear-loader')).toBeInTheDocument();
  });
});
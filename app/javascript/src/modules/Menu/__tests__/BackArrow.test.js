import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import ArrowBack from '../component/BackArrow';

describe('It should test the ArrowBack component', () => {
  it('it should render ArrowBack', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <ArrowBack path="/path" />
        </MockedProvider>
      </BrowserRouter>
    );

    expect(container.queryByTestId('arrow')).toBeInTheDocument();
  });

  it('it should not render ArrowBack', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <ArrowBack path="/" />
        </MockedProvider>
      </BrowserRouter>
    );

    expect(container.queryByTestId('arrow')).not.toBeInTheDocument();
  });
});

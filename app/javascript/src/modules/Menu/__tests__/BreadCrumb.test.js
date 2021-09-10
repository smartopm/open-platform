import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import BreadCrumb from '../component/BreadCrumb';

describe('It should test the breadCrumb component', () => {
  const data = ['test1', 'test2']
  const data2 = [] 

  it('it should render bread crumbs', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <BreadCrumb
            data={data}
          />
        </MockedProvider>
      </BrowserRouter>
    );
    expect(container.queryByTestId('home')).toBeInTheDocument();
    expect(container.queryByTestId('link')).toBeInTheDocument();
    expect(container.queryByTestId('title')).toBeInTheDocument();
  });

  it('it should not show bread crumbs', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <BreadCrumb
            data={data2}
          />
        </MockedProvider>
      </BrowserRouter>
    );
    expect(container.queryByTestId('home')).not.toBeInTheDocument();
    expect(container.queryByTestId('link')).not.toBeInTheDocument();
  });
});

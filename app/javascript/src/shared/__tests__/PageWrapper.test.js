import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import PageWrapper from '../PageWrapper';

describe('PageWrapper component', () => {
  it('should render without error', () => {
    const props = {
      children: <div>sampleText</div>
    };
    const rendered = render(
      <BrowserRouter>
        <MockedProvider>
          <PageWrapper {...props} />
        </MockedProvider>
      </BrowserRouter>
    );

    expect(rendered.queryByText('sampleText')).toBeInTheDocument();
  });
});

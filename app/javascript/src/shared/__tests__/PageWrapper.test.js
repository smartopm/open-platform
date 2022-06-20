import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import PageWrapper from '../PageWrapper';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('PageWrapper component', () => {
  it('should render without error', () => {
    const props = {
      children: <div>sampleText</div>
    };
    const rendered = render(
      <BrowserRouter>
        <MockedProvider>
          <MockedThemeProvider>
            <PageWrapper {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    expect(rendered.queryByText('sampleText')).toBeInTheDocument();
  });
});

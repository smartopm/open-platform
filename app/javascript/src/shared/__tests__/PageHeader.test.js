import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import PageHeader from '../PageHeader';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('PageHeader component', () => {
  it('should render without error', () => {
    const props = {
      linkText: 'sample Link Text',
      linkHref: '/samplelink',
      pageName: 'sampleName',
      PageTitle: 'sampleTitle'
    };
    const rendered = render(
      <BrowserRouter>
        <MockedProvider>
          <MockedThemeProvider>
            <PageHeader {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );
    expect(rendered.queryByText('sample Link Text')).toBeInTheDocument();
    expect(rendered.queryByText('sampleName')).toBeInTheDocument();
    expect(rendered.queryByText('sampleTitle')).toBeInTheDocument();
  });
});

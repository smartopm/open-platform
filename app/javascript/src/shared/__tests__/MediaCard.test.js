import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import MediaCard from '../MediaCard';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('MediaCard component', () => {
  it('should render without error', () => {
    const props = {
      title: 'sample title',
      subtitle: 'sample subtitle',
      imageUrl: 'imgurl.jpg'
    };
    const rendered = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <MockedProvider>
            <MediaCard {...props} />
          </MockedProvider>
        </MockedThemeProvider>
      </BrowserRouter>
    );

    expect(rendered.queryByText('sample title')).toBeInTheDocument();
    expect(rendered.queryByTestId('subtitle')).toBeInTheDocument();
    expect(rendered.queryByTestId('image')).toBeInTheDocument();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import ControlledCard from '../ControlledCard';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('ControlledCard component', () => {
  it('should render without error', () => {
    const props = {
      subtitle: 'sample subtitle',
      imageUrl: 'imgurl.jpg'
    };
    const rendered = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <MockedProvider>
            <ControlledCard {...props} />
          </MockedProvider>
        </MockedThemeProvider>
      </BrowserRouter>
    );

    expect(rendered.queryByTestId('content')).toBeInTheDocument();
    expect(rendered.queryByTestId('image')).toBeInTheDocument();
  });
});

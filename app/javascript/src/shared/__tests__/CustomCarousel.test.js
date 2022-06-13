import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';
import CustomCarousel from '../CustomCarousel';

describe('CustomCarousel component', () => {
  it('should render without error', async () => {
    const props = {
      imageUrls: [],
      videoUrls: []
    };
    render(
      <BrowserRouter>
        <MockedThemeProvider>
          <MockedProvider>
            <CustomCarousel {...props} />
          </MockedProvider>
        </MockedThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      screen.debug(undefined, 20000)
      expect(screen.queryByTestId('carousel-container')).toBeInTheDocument()
    }, 10)
  });
});

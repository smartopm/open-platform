import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';
import CustomMediaStepper from '../MediaStepper';

describe('CustomMediaStepper component', () => {
  it('should render without error', async () => {
    const props = {
      activeStep:0,
      maxSteps: 1,
      handleNext: jest.fn(),
      handlePrevious: jest.fn(),
      handleStepChange: jest.fn()
    };
    render(
      <BrowserRouter>
        <MockedThemeProvider>
          <MockedProvider>
            <CustomMediaStepper {...props} />
          </MockedProvider>
        </MockedThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('media-stepper-container')).toBeInTheDocument()
      expect(screen.queryByTestId('previous-btn')).toBeInTheDocument()
      expect(screen.queryByTestId('KeyboardArrowLeftIcon')).toBeInTheDocument()
      expect(screen.queryByTestId('next-btn')).toBeInTheDocument()
      expect(screen.queryByTestId('KeyboardArrowRightIcon')).toBeInTheDocument()

      expect(screen.queryByTestId('pagination-dot-container')).toBeInTheDocument()
      expect(screen.queryByTestId('pagination_dot_btn')).toBeInTheDocument()
    }, 10)
  });
});

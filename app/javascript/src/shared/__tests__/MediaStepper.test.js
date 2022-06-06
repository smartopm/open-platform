import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';
import CustomMediaStepper, { Pagination, PaginationDot } from '../MediaStepper';

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

describe('Pagination component', () => {
  it('should render 3 media pagination correctly', async () => {
    const props = {
      dots:3,
      index: 1,
      onChangeIndex: jest.fn(),
    };
    render(
      <BrowserRouter>
        <MockedThemeProvider>
          <MockedProvider>
            <Pagination {...props} />
          </MockedProvider>
        </MockedThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('pagination-dot-container')).toBeInTheDocument()
      expect(screen.queryAllByTestId('pagination_dot_btn')).toHaveLength(3)
    }, 10)
  });

  it('should render 1 dot pagination correctly', async () => {
    const props = {
      dots:1,
      index: 0,
      onChangeIndex: jest.fn(),
    };
    render(
      <BrowserRouter>
        <MockedThemeProvider>
          <MockedProvider>
            <Pagination {...props} />
          </MockedProvider>
        </MockedThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      screen.debug()
      expect(screen.queryByTestId('pagination-dot-container')).toBeInTheDocument()
      expect(screen.queryAllByTestId('pagination_dot_btn')).toHaveLength(1)
    }, 10)
  });
});

describe('PaginationDot component', () => {
  it('should render correctly', async () => {
    const props = {
      active:false,
      activeIndex: 1,
      onClick: jest.fn(),
    };
    render(
      <BrowserRouter>
        <MockedThemeProvider>
          <MockedProvider>
            <PaginationDot {...props} />
          </MockedProvider>
        </MockedThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      screen.debug(undefined, 2000)
      expect(screen.queryByTestId('pagination_dot_btn')).toBeInTheDocument()
    }, 10)
  });
});
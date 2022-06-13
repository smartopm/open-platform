import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import ImageArea from "../../imageUpload/ImageArea";
import MockedThemeProvider from '../../../modules/__mocks__/mock_theme';

describe('Image Area component', () => {
  it('should render ImageArea component correctly', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <ImageArea
              handleClick={jest.fn()}
              handleChange={jest.fn()}
              imageUrl="file.jpg"
              type="front"
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByTestId('image_area')).toBeInTheDocument();
    expect(container.queryByTestId('upload_preview')).toBeInTheDocument();
  });
  it('should render defaults when no images are provided', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <ImageArea
              handleClick={jest.fn()}
              handleChange={jest.fn()}
              token="sample_token"
              type="front"
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByTestId('empty_grid')).toBeInTheDocument();
    expect(container.queryByTestId('skeleton_section')).toBeInTheDocument();
    expect(container.queryByText('front')).toBeInTheDocument();
  });
});

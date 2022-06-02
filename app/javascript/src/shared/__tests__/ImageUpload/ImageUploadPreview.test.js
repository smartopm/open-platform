import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ImageUploadPreview from "../../imageUpload/ImageUploadPreview";

describe('Image Upload Preview', () => {
  const imageUrls = ['test.jpd']
  const closeButtonData = {
    closeButton: true,
    handleCloseButton: jest.fn
  }
  it('should render image uploader component', () => {
    const container = render(<ImageUploadPreview imageUrls={imageUrls} token='sample token' closeButtonData={closeButtonData} />);
    expect(container.queryByTestId('upload_preview')).toBeInTheDocument();
    expect(container.queryByTestId('image_close')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('image_close'))
  });
});
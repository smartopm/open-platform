import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import ImageUploadPreview from '../../../shared/imageUpload/ImageUploadPreview';

describe('Image Upload Preview', () => {
  const imageUrls = ['test.jpg']
  it('should render image uploader component', () => {
    const container = render(<ImageUploadPreview imageUrls={imageUrls} token='sample token' />);
    expect(container.queryByTestId('upload_preview')).toBeInTheDocument();
  });
});
import React from 'react';
import { render } from '@testing-library/react';
import ImageCropper from '../components/ImageCropper';

describe('Image Cropper', () => {
  it('should have test image Cropper component', () => {
    const container = render(
      <ImageCropper getBlob={jest.fn()} inputImg="image.jpg" fileName="name-sample" />
    );
    expect(container.queryByTestId('cropper')).toBeInTheDocument();
  
  });
});

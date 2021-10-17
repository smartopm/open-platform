import React from 'react';
import { render } from '@testing-library/react';
import ImageUploader from '../../../shared/imageUpload/ImageUploader';

describe('Image Uploader', () => {
  it('should render image uploader component', () => {
    const btn = render(<ImageUploader handleChange={jest.fn()} buttonText="button" useDefaultIcon />);
    expect(btn.queryByTestId('upload_button').textContent).toContain('button');
  });
});
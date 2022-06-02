import React from 'react';
import { render } from '@testing-library/react';

import ImageUploader from "../../imageUpload/ImageUploader";

describe('Image Uploader', () => {
  it('should render image uploader component', () => {
    const btn = render(
      <ImageUploader handleChange={jest.fn()} buttonText="button" useDefaultIcon />
    );
    expect(btn.queryByTestId('upload_button').textContent).toContain('button');
  });
  it('should render image uploader when no defaultIcon', () => {
    const btn = render(
      <ImageUploader
        handleChange={jest.fn()}
        buttonText=""
        useDefaultIcon={false}
        icon={<i>icon</i>}
      />
    );
    expect(btn.queryByTestId('upload_button_icon')).toBeInTheDocument();
  });
});

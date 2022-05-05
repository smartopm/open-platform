import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UploadFileItem from '../../imageUpload/UploadFileItem';
import MockedThemeProvider from '../../../modules/__mocks__/mock_theme';

describe('Image Area component', () => {
  it('should render ImageArea component correctly', () => {
    const file = {
      type: 'video/mp4',
      name: 'nice_video.mp4',
      size: 2000000
    };
    const formState = {
      isUploading: false,
      currentPropId: '0909',
      currentFileNames: [file.name, 'another_video.mp4']
    };

    const handleUpload = jest.fn();
    const handleRemoveFile = jest.fn();
    const formPropertyId = '0909';
    const isUploaded = false;
    const translate = jest.fn(() => 'Upload');
    const container = render(
      <MockedThemeProvider>
        <UploadFileItem
          file={file}
          formState={formState}
          handleUpload={handleUpload}
          handleRemoveFile={handleRemoveFile}
          formPropertyId={formPropertyId}
          isUploaded={isUploaded}
          translate={translate}
        />
      </MockedThemeProvider>
    );
    expect(container.queryByTestId('file_uploaded')).not.toBeInTheDocument();
    expect(container.queryByTestId('upload_loader')).not.toBeInTheDocument();
    expect(container.queryByTestId('upload_btn')).toBeInTheDocument();
    expect(container.queryByTestId('upload_btn').textContent).toContain('Upload');
    expect(container.queryByTestId('file_name')).toBeInTheDocument();
    expect(container.queryByTestId('file_name').textContent).toContain('Nice_video');
    expect(container.queryByTestId('file_size')).toBeInTheDocument();
    expect(container.queryByTestId('file_size').textContent).toContain('2 MB');
    expect(container.queryByTestId('file_type')).toBeInTheDocument();
    expect(container.queryByTestId('file_type').textContent).toContain('Upload'); // shows upload because of translations
    expect(container.queryByTestId('remove_upload_icon')).toBeInTheDocument();
    expect(container.queryByTestId('remove_upload_btn')).toBeInTheDocument();

    // upload
    fireEvent.click(container.queryByTestId('upload_btn'));
    expect(handleUpload).toBeCalled();
    expect(handleUpload).toBeCalledWith(
      { name: 'nice_video.mp4', size: 2000000, type: 'video/mp4' },
      '0909'
    );
    // remove file
    fireEvent.click(container.queryByTestId('remove_upload_btn'));
    expect(handleRemoveFile).toBeCalled();
    expect(handleRemoveFile).toBeCalledWith(
      { name: 'nice_video.mp4', size: 2000000, type: 'video/mp4' },
      false,
      '0909'
    );
  });

  it('should show checked icon when file is uploaded', () => {
    const file = {
      type: 'video/mp4',
      name: 'nice_video.mp4',
      size: 2000000
    };
    const formState = {
      isUploading: false,
      currentPropId: '0909',
      currentFileNames: [file.name, 'another_video.mp4']
    };

    const handleUpload = jest.fn();
    const handleRemoveFile = jest.fn();
    const formPropertyId = '0909';
    const isUploaded = true;
    const translate = jest.fn(() => 'Upload');
    const container = render(
      <MockedThemeProvider>
        <UploadFileItem
          file={file}
          formState={formState}
          handleUpload={handleUpload}
          handleRemoveFile={handleRemoveFile}
          formPropertyId={formPropertyId}
          isUploaded={isUploaded}
          translate={translate}
        />
      </MockedThemeProvider>
    );
    expect(container.queryByTestId('file_uploaded')).toBeInTheDocument();
  });
  it('should show the loading spinner when file is being uploaded', () => {
    const file = {
      type: 'video/mp4',
      name: 'nice_video.mp4',
      size: 2000000,
      propertyId: 'sdfwyewfefd'
    };
    const formState = {
      isUploading: true,
      currentPropId: '0909',
      currentFileNames: [`${file.name}${file.propertyId}`, 'another_video.mp4']
    };

    const handleUpload = jest.fn();
    const handleRemoveFile = jest.fn();
    const formPropertyId = '0909';
    const isUploaded = false;
    const translate = jest.fn(() => 'Upload');
    const container = render(
      <MockedThemeProvider>
        <UploadFileItem
          file={file}
          formState={formState}
          handleUpload={handleUpload}
          handleRemoveFile={handleRemoveFile}
          formPropertyId={formPropertyId}
          isUploaded={isUploaded}
          translate={translate}
        />
      </MockedThemeProvider>
    );
    expect(container.queryByTestId('upload_loader')).toBeInTheDocument();
    expect(container.queryByTestId('remove_upload_btn')).toBeDisabled();
  });
});

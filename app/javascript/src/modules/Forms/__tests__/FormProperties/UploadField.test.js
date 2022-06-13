import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Upload from '../../components/FormProperties/UploadField';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

describe('Upload component', () => {
  it('should show the upload field', () => {
    const handler = jest.fn();
    const props = {
      upload: handler,
      detail: { status: '', type: 'file', label: 'Image Label', required: true, id: '1234' },
      editable: false,
      uploaded: false,
      btnColor: 'primary'
    };
    const container = render(
      <MockedThemeProvider>
        <Upload {...props} />
      </MockedThemeProvider>
    );
    const uploadBtn = container.queryByLabelText('upload_button_Image Label');
    const uploadField = container.queryByLabelText('upload_field_Image Label');
    expect(uploadBtn).not.toBeDisabled();
    fireEvent.change(uploadField);
    expect(handler).toHaveBeenCalled();
    expect(container.queryByText('form:misc.select_file')).toBeInTheDocument();
    expect(container.queryByText('Image Label *')).toBeInTheDocument();
    expect(container.queryByTestId('upload_icon')).toBeInTheDocument();

  });

  it('should show validation error message', () => {
    const handler = jest.fn();
    const props = {
      upload: handler,
      handleValue: jest.fn(),
      detail: { status: '', type: 'file', label: 'Image Label', required: true, id: '123' },
      editable: false,
      btnColor: 'primary'
    };
    const rendered = render(
      <MockedThemeProvider>
        <Upload {...props} inputValidation={{ error: true }} />
      </MockedThemeProvider>
    );
    expect(rendered.queryByText('form:errors.required_field')).toBeInTheDocument();
  });

  it('should show file count when files are uploaded', () => {
    const handler = jest.fn();
    const props = {
      upload: handler,
      handleValue: jest.fn(),
      detail: { status: '', type: 'file', label: 'Image Label', required: true, id: '123', fileCount: 20 },
      editable: false,
      btnColor: 'primary',
      uploaded: true,
      showDetails: true
    };
    const container = render(
      <MockedThemeProvider>
        <Upload {...props} inputValidation={{ error: true }} />
      </MockedThemeProvider>
    );
    expect(container.queryByTestId('upload_details')).toBeInTheDocument();
    expect(container.queryByTestId('details_button').textContent).toContain('20 form:misc.file_uploaded');
    expect(container.queryByTestId('done_icon')).toBeInTheDocument();
  });
});

import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import SubmittedFileItem from '../../imageUpload/SubmittedFileItem';

describe('Submitted form files', () => {
  const attachment = { file_name: 'abc.jpg', image_url: 'https://imag.jpg' };
  const translate = jest.fn(() => 'translated');
  const downloadFile = jest.fn();
  const classes = {};
  const legacyFile = {
    fileName: 'abcdef.jpg',
    imageUrl: 'https://legacy.jpg',
    formProperty: { fieldName: 'Uploads' }
  };
  it('should render the files properly for newer type of uploads', () => {
    const container = render(
      <SubmittedFileItem
        translate={translate}
        attachment={attachment}
        downloadFile={downloadFile}
        legacyFile={legacyFile}
        classes={classes}
      />
    );
    expect(container.queryByTestId('attachment_name')).toBeInTheDocument();
    expect(container.queryByTestId('attachment_name')).toHaveTextContent('Uploads');
    expect(container.queryByTestId('filename')).toHaveTextContent('abc.jpg');
    expect(container.queryByTestId('download-icon')).toHaveTextContent('translated');

    fireEvent.click(container.queryByTestId('download-icon'));
    expect(downloadFile).toBeCalled();
  });

  it('should render the files properly for legacy uploads', () => {
    const container = render(
      <SubmittedFileItem
        translate={translate}
        downloadFile={downloadFile}
        legacyFile={legacyFile}
        classes={classes}
      />
    );
    expect(container.queryByTestId('attachment_name')).toBeInTheDocument();
    expect(container.queryByTestId('filename')).toHaveTextContent('abcdef.jpg');
    expect(container.queryByTestId('download-icon')).toHaveTextContent('translated');

    fireEvent.click(container.queryByTestId('download-icon'));
    expect(downloadFile).toBeCalled();
  });
  it('should render not render anything when there are no files for that property', () => {
    const container = render(
      <SubmittedFileItem
        translate={translate}
        downloadFile={downloadFile}
        legacyFile={{}}
        classes={classes}
      />
    );
    expect(container.queryByTestId('download-icon')).not.toBeInTheDocument();
  });
});

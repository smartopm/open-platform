import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DialogWithImageUpload from '../../dialogs/DialogWithImageUpload';
import MockedThemeProvider from '../../../modules/__mocks__/mock_theme';

describe('It should render dialog-with-image-upload', () => {
  it('should render with dialog', () => {
    const mock = jest.fn();
    const imageUrls = ['dummy_link.jpg'];
    const modalDetails = {
      title: 'Here is the dialog title',
      inputPlaceholder: 'Input placholder',
      uploadBtnText: 'Add a photo',
      subTitle: 'A dialog subtitle',
      uploadInstruction: 'Please upload an image',
      userType: 'admin',
      actionVisibilityOptions: { admin: 'Admins Only', everyone: 'Everyone' },
      actionVisibilityLabel: 'who can see this post?',
      handleVisibilityOptions: () => {},
      visibilityValue: 'Everyone'
    };

    const container = render(
      <MockedThemeProvider>
        <DialogWithImageUpload
          open
          observationHandler={{
            value: 'Some default value',
            handleChange: mock
          }}
          handleDialogStatus={jest.fn()}
          imageOnchange={jest.fn()}
          imageUrls={imageUrls}
          status="INIT"
          modalDetails={modalDetails}
        >
          <p>Some text child of entry note</p>
        </DialogWithImageUpload>
      </MockedThemeProvider>
    );
    expect(container.queryByTestId('entry-dialog')).toBeInTheDocument();
    expect(container.queryByText('Here is the dialog title')).toBeInTheDocument();
    expect(container.queryAllByText('A dialog subtitle')[0]).toBeInTheDocument();
    expect(container.queryByText('Please upload an image')).toBeInTheDocument();
    expect(container.queryByText('Add a photo')).toBeInTheDocument();
    expect(container.queryAllByTestId('entry-dialog-field')[0]).toBeInTheDocument();
    expect(container.queryByText('Some text child of entry note')).toBeInTheDocument();
    expect(container.queryByTestId('upload_label')).toBeInTheDocument();
    expect(container.queryByTestId('entry-dialog-close-icon')).toBeInTheDocument();
    expect(container.queryAllByTestId('upload_button')[0]).toBeInTheDocument();
    expect(container.queryByTestId('visibilty-select')).toBeInTheDocument();
  });
});

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { useTranslation } from 'react-i18next';
import FormMenu from '../components/FormMenu';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('TextInput component', () => {
  const { t } = useTranslation(['common', 'form']);
  const props = {
    handleClose: jest.fn(),
    formId: 'sjhef3042432',
    anchorEl: document.createElement('button'),
    open: true,
    refetch: jest.fn(),
    formName: 'sexample',
    t,
    isPublic: true
  };

  it('should not break the text input', async () => {
    const rendered = render(
      <BrowserRouter>
        <MockedProvider mocks={[]}>
          <MockedThemeProvider>
            <FormMenu {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(rendered.queryByText('common:menu.edit')).toBeInTheDocument();
      expect(rendered.queryByText('common:menu.publish')).toBeInTheDocument();
      expect(rendered.queryByText('common:menu.delete')).toBeInTheDocument();
      expect(rendered.queryByText('common:menu.form_qrcode')).toBeInTheDocument();

      fireEvent.click(rendered.queryByText('common:menu.submit_form'));
      fireEvent.click(rendered.queryByText('common:menu.edit'));
      fireEvent.click(rendered.queryByText('common:menu.delete'));
      expect(props.handleClose).toBeCalled();

      fireEvent.click(rendered.queryByText('common:menu.publish'));
      expect(rendered.queryByText('form_actions.cancel')).toBeInTheDocument();
      fireEvent.click(rendered.queryByText('form_actions.cancel'));
      fireEvent.click(rendered.queryByTestId('proceed_button'));
      expect(props.handleClose).toBeCalled();
    });
  });

  it('should render public form qr code', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: () => {}
      }
    });

    const rendered = render(
      <BrowserRouter>
        <MockedProvider mocks={[]}>
          <MockedThemeProvider>
            <FormMenu {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(rendered.queryByText('common:menu.form_qrcode'));
      expect(rendered.queryByText('common:menu.form_qrcode_header')).toBeInTheDocument();
      expect(rendered.queryByTestId('qrcode_form_modal_close_icon')).toBeInTheDocument();
      expect(rendered.queryByTestId('main_qrcode')).toBeInTheDocument();
      expect(rendered.queryByTestId('qrcode_copy_btn')).toBeInTheDocument();
      expect(rendered.queryByTestId('qrcode_download_btn')).toBeInTheDocument();
      expect(rendered.queryByTestId('copy_detail')).toBeInTheDocument();
      expect(rendered.queryByTestId('download_detail')).toBeInTheDocument();

      fireEvent.click(rendered.queryByTestId('qrcode_copy_btn'));
      expect(rendered.queryByText('common:misc.copied')).toBeInTheDocument();
    });
  });

});

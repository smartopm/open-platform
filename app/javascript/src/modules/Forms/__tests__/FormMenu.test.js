import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { useTranslation } from 'react-i18next';
import FormMenu from '../components/FormMenu';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('TextInput component', () => {
  it('should not break the text input', async () => {
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
});

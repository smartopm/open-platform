import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormContextProvider from '../Context';
import FormCreate from '../components/FormCreate';
import { FormQuery } from '../graphql/forms_queries';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

jest.mock('react-markdown', () => <div />);
jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('FormCreate Component', () => {
  const { t } = useTranslation(['common', 'form']);
  const formMock = {
    request: {
      query: FormQuery,
      variables: { id: '7d05e98e-e6bb-43cb-838e-e6d76005e326' }
    },
    result: {
      data: {
        form: {
          id: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
          name: 'Another Registry V2',
          hasTermsAndConditions: true,
          preview: true,
          isPublic: true,
          description: 'This is a customs form',
          expiresAt: '2021-12-31T23:59:59Z',
          multipleSubmissionsAllowed: true,
          roles: []
        }
      }
    }
  };

  const props = {
    formMutation: jest.fn().mockImplementation(() => Promise.resolve()),
    refetch: jest.fn(),
    t
  };

  it('should render without crashing', async () => {
    const wrapper = render(
      <MockedProvider mocks={[formMock]} addTypename={false}>
        <BrowserRouter>
          <FormContextProvider>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <FormCreate {...props} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </FormContextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(wrapper.queryByTestId('title')).toBeInTheDocument();
      expect(wrapper.queryByTestId('description')).toBeInTheDocument();

      fireEvent.change(wrapper.queryByTestId('title'), { target: { value: 'This is a title' } });
      expect(wrapper.queryByTestId('title').value).toBe('This is a title');

      fireEvent.change(wrapper.queryByTestId('description'), {
        target: { value: 'This is a description' }
      });
      expect(wrapper.queryByTestId('description').value).toBe('This is a description');

      expect(wrapper.queryByLabelText('misc.limit_1_response')).toBeInTheDocument();
      expect(wrapper.queryByLabelText('misc.previewable')).toBeInTheDocument();
      expect(wrapper.queryByLabelText('misc.public_with_qrcode')).toBeInTheDocument();
      expect(wrapper.queryByTestId('HelpCenterRoundedIcon')).toBeInTheDocument();

      fireEvent.change(wrapper.queryByLabelText('misc.public_with_qrcode'), {
        target: { checked: true }
      });
      expect(wrapper.queryByLabelText('misc.public_with_qrcode').checked).toBe(true);

      fireEvent.change(wrapper.queryByLabelText('misc.public_with_qrcode'), {
        target: { checked: false }
      });
      expect(wrapper.queryByLabelText('misc.public_with_qrcode').checked).toBe(false);

      fireEvent.change(wrapper.queryByLabelText('misc.previewable'), { target: { checked: true } });
      expect(wrapper.queryByLabelText('misc.previewable').checked).toBe(true);

      fireEvent.change(wrapper.queryByLabelText('misc.limit_1_response'), {
        target: { checked: true }
      });
      expect(wrapper.queryByLabelText('misc.limit_1_response').checked).toBe(true);

      fireEvent.click(wrapper.queryByTestId('submit'));
      expect(props.formMutation).toHaveBeenCalled();
    });
  });

  it('should render when Id present', async () => {
    const newProps = { ...props, id: 'sdfwe8f9fuwfmeni34jnw', actionType: 'update' };
    const wrapper = render(
      <MockedProvider mocks={[formMock]} addTypename={false}>
        <BrowserRouter>
          <FormContextProvider>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <FormCreate {...newProps} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </FormContextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(wrapper.queryByTestId('title')).toBeInTheDocument();
      expect(wrapper.queryByTestId('description')).toBeInTheDocument();

      fireEvent.click(wrapper.queryByTestId('submit'));
      expect(props.formMutation).toHaveBeenCalled();
    });
  });
});

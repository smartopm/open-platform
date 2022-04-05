import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import FormContextProvider from '../Context';
import FormCreate from '../components/FormCreate';
import { FormQuery } from '../graphql/forms_queries';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('react-markdown', () => <div />);
jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('FormCreate Component', () => {
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
          preview: true,
          description: 'This is a customs form',
          expiresAt: '2021-12-31T23:59:59Z',
          multipleSubmissionsAllowed: true,
          roles: []
        }
      }
    }
  };

  const props = {
    formMutation: jest.fn(),
    refetch: jest.fn()
  };

  it('should render without crashing', async () => {
    const wrapper = render(
      <MockedProvider mocks={[formMock]} addTypename={false}>
        <BrowserRouter>
          <FormContextProvider>
            <MockedThemeProvider>
              <FormCreate {...props} />
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

      fireEvent.change(wrapper.queryByTestId('description'), { target: { value: 'This is a description' } });
      expect(wrapper.queryByTestId('description').value).toBe('This is a description');

      fireEvent.click(wrapper.queryByTestId('submit'))
      expect(props.formMutation).toHaveBeenCalled();
    });
  });

  it('should render when Id present', async () => {
    const newProps = {...props, id: 'sdfwe8f9fuwfmeni34jnw', actionType: 'update' }
    const wrapper = render(
      <MockedProvider mocks={[formMock]} addTypename={false}>
        <BrowserRouter>
          <FormContextProvider>
            <MockedThemeProvider>
              <FormCreate {...newProps} />
            </MockedThemeProvider>
          </FormContextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(wrapper.queryByTestId('title')).toBeInTheDocument();
      expect(wrapper.queryByTestId('description')).toBeInTheDocument();

      fireEvent.click(wrapper.queryByTestId('submit'))
      expect(props.formMutation).toHaveBeenCalled();
    });
  });
});

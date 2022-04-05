import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import FormContextProvider from '../../Context';
import Form from '../../components/Category/Form';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../__mocks__/authstate';
import { FormQuery } from '../../graphql/forms_queries';

jest.mock('react-markdown', () => <div />);
jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Form Component', () => {
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
          isPublic: true,
          description: 'This is a customs form',
          expiresAt: '2021-12-31T23:59:59Z',
          multipleSubmissionsAllowed: true,
          roles: []
        }
      }
    }
  }
  const props = {
    property: true,
    isPublishing: false,
    handleConfirmPublish: jest.fn(),
    formDetailData: { form: { name: 'sampleName', preview: true } },
    formDetailRefetch: jest.fn(),
    loading: false
  };

  it('should render without crashing', async () => {
    const wrapper = render(
      <MockedProvider>
        <BrowserRouter>
          <FormContextProvider>
            <MockedThemeProvider>
              <Form editMode formId="7d05e98e-e6bb-43cb-838e-e6d76005e326" {...props} />
            </MockedThemeProvider>
          </FormContextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(wrapper.queryByTestId('category-list-container')).toBeInTheDocument();
      expect(wrapper.queryByTestId('add_category').textContent).toContain(
        'form:actions.add_category'
      );
      fireEvent.click(wrapper.queryByTestId('add_category'));

      expect(wrapper.queryByText('form_fields.name')).toBeInTheDocument();
      expect(wrapper.queryByText('form_fields.description')).toBeInTheDocument();
      expect(wrapper.queryAllByText('form_fields.rendered_text')[0]).toBeInTheDocument();
      expect(wrapper.queryAllByTestId('loader')[0]).toBeInTheDocument();
      expect(wrapper.queryByTestId('add_category')).toBeInTheDocument();
      expect(wrapper.queryByTestId('publishing')).toBeInTheDocument();

      fireEvent.click(wrapper.queryByTestId('publishing'));
      expect(props.handleConfirmPublish).toHaveBeenCalled();
    });
  });

  it('should render without crashing if editMode is false', async () => {
    const wrapper = render(
      <MockedProvider mocks={[formMock]} addTypename={false}>
        <Context.Provider value={userMock}>
          <BrowserRouter>
            <FormContextProvider>
              <MockedThemeProvider>
                <Form formId="7d05e98e-e6bb-43cb-838e-e6d76005e326" editMode={false} />
              </MockedThemeProvider>
            </FormContextProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(wrapper.queryByTestId('category-list-container')).toBeInTheDocument();
      expect(wrapper.queryByTestId('submit_form_btn').textContent).toContain(
        'common:form_actions.submit'
      );
      expect(wrapper.queryByTestId('save_as_draft').textContent).toContain(
        'common:form_actions.save_as_draft'
      );
      expect(wrapper.queryByTestId('save_as_draft')).toBeInTheDocument();
      expect(wrapper.queryByTestId('submit_form_btn')).toBeInTheDocument();
    });
  });
});

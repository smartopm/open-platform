import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import FormContextProvider from '../../Context';
import Form from '../../components/Category/Form';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../__mocks__/authstate';
import { FormCategoriesQuery } from '../../graphql/form_category_queries';

jest.mock('react-markdown', () => <div />);
jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Form Component', () => {

  const formCategoriesMock = {
    request: {
      query: FormCategoriesQuery,
      variables: { formId: 'd7452f3e-7625-4db2-8533' }
    },
    result: {
      data: {
        formCategories: [{
          id: 'd7452f3e-7625-4db2-8533-9377f9c2879b',
          order: 1,
          fieldName: 'General',
          description: 'something',
          general: false,
          headerVisible: false,
          renderedText: ' ',
          displayCondition: {
            condition: '',
            groupingId: '',
            value: ''
          },
          formProperties: [
            {
              id: 'a96ac2c0-342e-42ac-841b-633fd262b8ab',
              groupingId: '3686db96-74f5-4ad0-907b-becb5ff6c41a',
              fieldName: 'Field Name',
              fieldType: 'text',
              fieldValue: [
                {
                  value: '',
                  label: ''
                }
              ],
              shortDesc: null,
              longDesc: null,
              required: false,
              adminUse: false,
              order: '1'
            },
            {
              id: '00040753-ae63-4ee8-9a5a-f377d238c9be',
              groupingId: 'cdd5baf6-396c-44b0-a9ea-9207c60bea52',
              fieldName: 'Upload files',
              fieldType: 'file_upload',
              fieldValue: [
                {
                  value: '',
                  label: ''
                }
              ],
              shortDesc: null,
              longDesc: null,
              required: false,
              adminUse: false,
              order: '1'
            }
          ]
        }]
      }
    }
  };

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
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[formCategoriesMock]}>
          <BrowserRouter>
            <FormContextProvider>
              <MockedThemeProvider>
                <Form editMode formId="d7452f3e-7625-4db2-8533" {...props} />
              </MockedThemeProvider>
            </FormContextProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
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

      // Temporarily removed, causes jest to run longer unnecessarily
      // fireEvent.click(wrapper.queryByTestId('publishing'));
      // expect(props.handleConfirmPublish).toHaveBeenCalled();
    }, 10);
  });

  it('should render without crashing if editMode is false', async () => {
    const wrapper = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[formCategoriesMock]} addTypename={false}>
          <BrowserRouter>
            <FormContextProvider>
              <MockedThemeProvider>
                <Form formId="d7452f3e-7625-4db2-8533" editMode={false} />
              </MockedThemeProvider>
            </FormContextProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(wrapper.queryAllByTestId('loader')[0]).toBeInTheDocument();
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
    }, 1000);
  });
  it('should not contain draft and submit button if no user', async () => {
    const wrapper = render(
      <Context.Provider value={{}}>
        <MockedProvider mocks={[formCategoriesMock]} addTypename={false}>
          <BrowserRouter>
            <FormContextProvider>
              <MockedThemeProvider>
                <Form formId="d7452f3e-7625-4db2-8533" editMode={false} />
              </MockedThemeProvider>
            </FormContextProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(wrapper.queryByTestId('save_as_draft')).not.toBeInTheDocument();
      expect(wrapper.queryByTestId('submit_form_btn')).not.toBeInTheDocument();
    });
  });
});

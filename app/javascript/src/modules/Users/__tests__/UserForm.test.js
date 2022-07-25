import React from 'react';
import { act, fireEvent, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import ReactTestUtils from 'react-dom/test-utils';
import UserForm, { formatContactType } from '../Components/UserForm';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { UserQuery } from '../../../graphql/queries';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('UserForm Component', () => {
  it('should render correct with form properties when creating and editing', async () => {
    const props = { isEditing: true, isFromRef: false };
    const user = {
      ...authState.user,
      address: '123 Primary Address Estate',
      contactInfos: []
    };
    const mocks = [
      {
        request: {
          query: UserQuery,
          variables: { id: user.id }
        },
        result: {
          data: {
            user
          }
        }
      }
    ];

    const container = render(
      <MockedProvider mocks={mocks}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <UserForm
                isEditing={props.isEditing}
                isFromRef={props.isFromRef}
                isAdminOrMarketingAdmin
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByLabelText('common:misc.take_photo')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.full_name')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.primary_number')).toBeInTheDocument();
      expect(container.queryAllByText('common:form_fields.primary_email')[0]).toBeInTheDocument();
      expect(
        container.queryAllByText('common:form_fields.external_reference')[0]
      ).toBeInTheDocument();
      expect(container.queryAllByText('common:form_fields.primary_address')[0]).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.user_type')).toBeInTheDocument();
      expect(container.queryByLabelText('common:form_fields.reason')).toBeInTheDocument();
      expect(container.queryByLabelText('common:form_fields.state')).toBeInTheDocument();
      expect(container.queryByLabelText('common:misc.customer_journey_stage')).toBeInTheDocument();
      expect(container.queryByTestId('submit_btn')).not.toBeDisabled();
      expect(container.queryByTestId('submit_btn')).toHaveTextContent('common:form_actions.submit');
      expect(container.queryByText('common:misc.referrals')).not.toBeInTheDocument();
      expect(container.queryByText('menu.user_edit')).toBeInTheDocument();
    }, 10);

    ReactTestUtils.Simulate.change(container.queryByTestId('username'), {
      target: { value: 'John Doe' }
    });

    expect(container.queryByTestId('username').value).toContain('John Doe');

    ReactTestUtils.Simulate.change(container.queryByTestId('primary_phone'), {
      target: { value: '090909090909' }
    });

    expect(container.queryByTestId('primary_phone').value).toContain('+090 909 090 909');

    ReactTestUtils.Simulate.change(container.queryByTestId('email'), {
      target: { value: 'abcdef.jkl' }
    });

    expect(container.queryByTestId('email').value).toContain('abcdef.jkl');

    ReactTestUtils.Simulate.change(container.queryByTestId('address'), {
      target: { value: '24th street, west' }
    });

    expect(container.queryByTestId('address').value).toContain('24th street, west');
    // when we hit submit button, it should not submit
    fireEvent.submit(container.queryByTestId('submit-form'));

    expect(container.queryByTestId('submit_btn')).toBeInTheDocument();
    expect(container.queryByTestId('submit_btn')).not.toBeDisabled();
    expect(container.queryByText('common:errors.invalid_email')).toBeInTheDocument();

    // update with valid email and hit submit again
    ReactTestUtils.Simulate.change(container.queryByTestId('email'), {
      target: { value: 'nurudeen@gmail.com' }
    });
    expect(container.queryByTestId('email').value).toContain('nurudeen@gmail.com');
    fireEvent.submit(container.queryByTestId('submit-form'));
    await waitFor(() => {
      expect(container.queryByTestId('submit_btn')).toBeDisabled();
    }, 10);
  });

  it('should contain referral form when referring', async () => {
    const props = { isEditing: false, isFromRef: true };
    const user = {
      ...authState.user,
      address: '123 Primary Address Estate',
      contactInfos: []
    };
    const mocks = [
      {
        request: {
          query: UserQuery,
          variables: { id: user.id }
        },
        result: {
          data: {
            user
          }
        }
      }
    ];
    const container = render(
      <MockedProvider mocks={mocks}>
        {/* use it as a mock for authState */}
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <UserForm
                isEditing={props.isEditing}
                isFromRef={props.isFromRef}
                isAdminOrMarketingAdmin={false}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByLabelText('common:misc.take_photo')).toBeNull();
      expect(container.queryByTestId('username')).toBeInTheDocument();
      expect(container.queryByTestId('primary_phone')).not.toBeNull();
      expect(container.queryByTestId('email')).not.toBeNull();
    }, 10);

    fireEvent.change(container.queryByTestId('username'), {
      target: { value: 'My New Name' }
    });
    expect(container.queryByTestId('username').value).toContain('My New Name');

    fireEvent.change(container.queryByTestId('primary_phone'), {
      target: { value: '090909090909' }
    });

    expect(container.queryByTestId('primary_phone').value).toContain('+090 909 090 909');
    expect(container.queryByTestId('referralText')).toHaveTextContent('common:misc.referral_text');
    expect(container.queryByText('common:misc.referrals')).toBeInTheDocument();
    expect(container.queryByText('menu.user_edit')).not.toBeInTheDocument();
    expect(container.queryByTestId('referralBtn')).not.toBeDisabled();
    expect(container.queryByTestId('referralBtn')).toHaveTextContent('common:misc.refer');
    expect(formatContactType('0233082', 'phone')).toMatchObject({
      contactType: 'phone',
      info: '0233082'
    });
  });

  it('should render contact infos', async () => {
    const props = { isEditing: true, isFromRef: false };
    const user = {
      ...authState.user,
      address: '123 Primary Address Estate',
      contactInfos: [
        { id: '123', info: 'xyz@gmail.com', contactType: 'email' },
        { id: '456', info: '123 Address Estate', contactType: 'address' },
        { id: '789', info: '23495087466573', contactType: 'phone' }
      ]
    };
    const mocks = [
      {
        request: {
          query: UserQuery,
          variables: { id: user.id }
        },
        result: {
          data: {
            user
          }
        }
      }
    ];

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserForm
              isEditing={props.isEditing}
              isFromRef={props.isFromRef}
              isAdminOrMarketingAdmin
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('add_type')).toHaveLength(3);
      expect(screen.queryAllByText('form_actions.add_type')).toHaveLength(3);
    }, 10);

    await act(async () => {
      fireEvent.click(screen.queryAllByTestId('add_type')[2]);
    });
  });
});

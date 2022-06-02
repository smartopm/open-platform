import React from 'react';
import { act, fireEvent, render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserForm, { formatContactType } from '../Components/UserForm';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { UserQuery } from '../../../graphql/queries';
import authState from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('UserForm Component', () => {
  it('should render correct with form properties when creating and editing', async () => {
    const props = { isEditing: true, isFromRef: false };
    const user = {
      ...authState.user,
      address: '123 Primary Address Estate',
      contactInfos: []
    }
    const mocks = [
      {
        request: {
          query: UserQuery,
          variables: {id: user.id}
        },
        result: {
          data: {
            user,
          }
        }
      }
    ]

    const container = render(
      <MockedProvider mocks={mocks}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <UserForm isEditing={props.isEditing} isFromRef={props.isFromRef} isAdmin />
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByLabelText('common:misc.take_photo')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.full_name')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.primary_number')).toBeInTheDocument();
      expect(container.queryAllByText('common:form_fields.primary_email')[0]).toBeInTheDocument();
      expect(container.queryAllByText('common:form_fields.external_reference')[0]).toBeInTheDocument();
      expect(container.queryAllByText('common:form_fields.primary_address')[0]).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.user_type')).toBeInTheDocument();
      expect(container.queryByLabelText('common:form_fields.reason')).toBeInTheDocument();
      expect(container.queryByLabelText('common:form_fields.state')).toBeInTheDocument();
      expect(container.queryByLabelText('common:misc.customer_journey_stage')).toBeInTheDocument();
      expect(container.queryByTestId('submit_btn')).not.toBeDisabled();
      expect(container.queryByTestId('submit_btn')).toHaveTextContent('common:form_actions.submit');
    }, 10)

      fireEvent.change(container.queryByTestId('primary_phone'), {
        target: { value: '090909090909' }
      });

      expect(container.queryByTestId('primary_phone').value).toContain('090909090909');

      userEvent.type(container.queryByTestId('email'), 'abcdef.jkl')

      expect(container.queryByTestId('email').value).toContain('abcdef.jkl');

      fireEvent.change(container.queryByTestId('address'), {
        target: { value: '24th street, west' }
      });

      expect(container.queryByTestId('address').value).toContain('24th street, west');
      // when we hit submit button, it should get disabled
      fireEvent.submit(container.queryByTestId('submit-form'));
      expect(container.queryByTestId('submit_btn')).not.toBeDisabled();
      expect(container.queryByText('common:errors.invalid_email')).toBeInTheDocument();

      // update with valid email and hit submit again
      userEvent.type(container.queryByTestId('email'), 'nurudeen@gmail.com')
      expect(container.queryByTestId('email').value).toContain('nurudeen@gmail.com');
      fireEvent.submit(container.queryByTestId('submit-form'));
      await waitFor(() => {
        expect(container.queryByTestId('submit_btn')).toBeDisabled();
      }, 10)
    });

  it('should contain referral form when referring', async () => {
    const props = { isEditing: false, isFromRef: true };
    const user = {
      ...authState.user,
      address: '123 Primary Address Estate',
      contactInfos: []
    }
    const mocks = [
      {
        request: {
          query: UserQuery,
          variables: {id: user.id}
        },
        result: {
          data: {
            user,
          }
        }
      }
    ]
    const container = render(
      <MockedProvider mocks={mocks}>
        {/* use it as a mock for authState */}
        <Context.Provider value={authState}>
          <BrowserRouter>
            <UserForm isEditing={props.isEditing} isFromRef={props.isFromRef} isAdmin={false} />
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByLabelText('common:misc.take_photo')).toBeNull();
      expect(container.queryByTestId('clientName')).toBeInTheDocument();
      expect(container.queryByTestId('clientName')).toBeDisabled();
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

      expect(container.queryByTestId('primary_phone').value).toContain('090909090909');
      expect(container.queryByTestId('referralText')).toHaveTextContent(
        'common:misc.referral_text'
      );
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
        { id: '789', info: '23495087466573', contactType: 'phone' },
      ]
    }
    const mocks = [
      {
        request: {
          query: UserQuery,
          variables: {id: user.id}
        },
        result: {
          data: {
            user,
          }
        }
      }
    ]

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <UserForm isEditing={props.isEditing} isFromRef={props.isFromRef} isAdmin />
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

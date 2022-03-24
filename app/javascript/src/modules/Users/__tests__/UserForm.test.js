import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserForm, { formatContactType } from '../Components/UserForm';
import { AuthStateProvider } from '../../../containers/Provider/AuthStateProvider';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('UserForm Component', () => {
  it('should render correct with form properties when creating and editing', async () => {
    const props = { isEditing: true, isFromRef: false };
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <UserForm isEditing={props.isEditing} isFromRef={props.isFromRef} isAdmin />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByLabelText('common:misc.take_photo')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.full_name')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.primary_number')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.primary_email')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.external_reference')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.primary_address')).toBeInTheDocument();
      expect(container.queryByText('common:form_fields.user_type')).toBeInTheDocument();
      expect(container.queryByLabelText('common:form_fields.reason')).toBeInTheDocument();
      expect(container.queryByLabelText('common:form_fields.state')).toBeInTheDocument();
      expect(container.queryByLabelText('common:misc.customer_journey_stage')).toBeInTheDocument();
      expect(container.queryByTestId('submit_btn')).not.toBeDisabled();
      expect(container.queryByTestId('submit_btn')).toHaveTextContent('common:form_actions.submit');

      fireEvent.change(container.queryByTestId('primary_phone'), {
        target: { value: '090909090909' }
      });

      expect(container.queryByTestId('primary_phone').value).toContain('090909090909');

      fireEvent.change(container.queryByTestId('email'), {
        target: { value: 'abc@def.jkl' }
      });

      expect(container.queryByTestId('email').value).toContain('abc@def.jkl');

      fireEvent.change(container.queryByTestId('address'), {
        target: { value: '24th street, west' }
      });

      expect(container.queryByTestId('address').value).toContain('24th street, west');
      // when we hit submit button, it should get disabled
      fireEvent.submit(container.queryByTestId('submit-form'));
      expect(container.queryByTestId('submit_btn')).toBeDisabled();
    });
  });
  it('should contain referral form when referring', async () => {
    const props = { isEditing: false, isFromRef: true };
    const container = render(
      <MockedProvider mocks={[]}>
        {/* use it as a mock for authState */}
        <AuthStateProvider>
          <BrowserRouter>
            <UserForm isEditing={props.isEditing} isFromRef={props.isFromRef} isAdmin={false} />
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByLabelText('common:misc.take_photo')).toBeNull();
      expect(container.queryByTestId('clientName')).toBeInTheDocument();
      expect(container.queryByTestId('clientName')).toBeDisabled();
      expect(container.queryByTestId('username')).toBeInTheDocument();
      expect(container.queryByTestId('primary_phone')).not.toBeNull();
      expect(container.queryByTestId('email')).not.toBeNull();

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
  });
});

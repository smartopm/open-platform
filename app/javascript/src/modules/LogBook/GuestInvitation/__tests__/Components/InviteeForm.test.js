/* eslint-disable max-statements */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/extend-expect';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/authstate';
import InviteeForm from '../../Components/InviteeForm';

describe('Guest Invitation Form', () => {
  it('should render the invitation form', async () => {
    const guest = { firstName: 'some name', lastName: 'Jan', phoneNumber: null, isAdded: false };
    const handlePhoneNumber = jest.fn()
    const handleInputChange = jest.fn()
    const handleRemoveUser = jest.fn()
    const handleAddUser = jest.fn()

    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <Context.Provider value={userMock}>
          <InviteeForm
            guestData={guest}
            handlePhoneNumber={handlePhoneNumber}
            handleInputChange={handleInputChange}
            handleRemoveUser={handleRemoveUser}
            handleAddUser={handleAddUser}
            guestCount={1}
          />
        </Context.Provider>
      </MemoryRouter>
    );

    const firstName = getByTestId('guest_entry_first_name');
    const lastName = getByTestId('guest_entry_last_name');
    const phoneNumber = getByTestId('guest_entry_phone_number');

    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(phoneNumber).toBeInTheDocument();
    expect(getByText('logbook:guest_book.guest #1')).toBeInTheDocument();

    fireEvent.change(firstName, { target: { value: 'Some random firstName' } });
    expect(firstName.value).toBe('Some random firstName');

    fireEvent.change(lastName, { target: { value: 'Some random lastName' } });
    expect(lastName.value).toBe('Some random lastName');

    expect(phoneNumber).not.toBeDisabled()
    fireEvent.change(phoneNumber, { target: { value: '090909090' } });
    expect(phoneNumber.value).toBe('090909090');

    expect(getByTestId('add_remove_guest_btn')).toBeInTheDocument();
    expect(getByTestId('add_remove_guest_btn').textContent).toContain('misc.add')

    fireEvent.click(getByTestId('add_remove_guest_btn'));
    expect(handleAddUser).toBeCalled()
  });
});

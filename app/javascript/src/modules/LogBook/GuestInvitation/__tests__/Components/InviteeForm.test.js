import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/authstate';
import InviteeForm from '../../Components/InviteeForm';

describe('Guest Invitation Form', () => {
  const guest = { firstName: 'some name', lastName: 'Jan', phoneNumber: null, isAdded: false };
  const handlePhoneNumber = jest.fn();
  const handleInputChange = jest.fn();
  const handleAction = jest.fn();

  it('should render the non-primary invitation form', () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <Context.Provider value={userMock}>
          <InviteeForm
            guestData={guest}
            handlePhoneNumber={handlePhoneNumber}
            handleInputChange={handleInputChange}
            handleAction={handleAction}
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
    expect(getByText('logbook:guest_book.new_guest #1')).toBeInTheDocument();

    fireEvent.change(firstName, { target: { value: 'Some random firstName' } });
    expect(firstName.value).toBe('Some random firstName');

    fireEvent.change(lastName, { target: { value: 'Some random lastName' } });
    expect(lastName.value).toBe('Some random lastName');

    expect(phoneNumber).not.toBeDisabled();
    fireEvent.change(phoneNumber, { target: { value: '090909090' } });
    expect(phoneNumber.value).toBe('090909090');

    expect(getByTestId('add_remove_guest_btn')).toBeInTheDocument();
    expect(getByTestId('add_remove_guest_btn').textContent).toContain('misc.remove');

    fireEvent.click(getByTestId('add_remove_guest_btn'));
    expect(handleAction).toBeCalled();
  });

  it('should render the primary form to add other guests', () => {
    const { getByTestId, queryByTestId } = render(
      <MemoryRouter>
        <Context.Provider value={userMock}>
          <InviteeForm
            guestData={guest}
            handlePhoneNumber={handlePhoneNumber}
            handleInputChange={handleInputChange}
            handleAction={handleAction}
            primary
          />
        </Context.Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByTestId('guest_entry_first_name'), {
      target: { value: 'Some random firstName' }
    });
    expect(getByTestId('guest_entry_first_name').value).toBe('Some random firstName');

    fireEvent.change(getByTestId('guest_entry_last_name'), {
      target: { value: 'Some random Last Name' }
    });
    expect(getByTestId('guest_entry_last_name').value).toBe('Some random Last Name');

    expect(getByTestId('add_remove_guest_btn')).toBeInTheDocument();
    expect(getByTestId('add_remove_guest_btn').textContent).toContain('misc.add');
    
    fireEvent.click(getByTestId('add_remove_guest_btn'));
    expect(handleAction).toBeCalled();
    
    expect(getByTestId('guest_type').textContent).toContain('logbook:guest.guest_type');
    expect(getByTestId('person_mode').textContent).toContain('misc.person');
    expect(getByTestId('company_mode').textContent).toContain('misc.company');
    // company name should not be available before we switch
    expect(queryByTestId('company_name')).not.toBeInTheDocument();
    
    fireEvent.click(getByTestId('company_mode'));
    expect(getByTestId('company_name')).toBeInTheDocument();
  });
});

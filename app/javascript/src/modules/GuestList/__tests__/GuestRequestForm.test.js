import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { GuestListEntryQuery } from '../../../graphql/queries';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import userMock from '../../../__mocks__/userMock';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import GuestRequestForm from '../Components/GuestRequestForm';


describe('GuestRequestForm Component ', () => {
  const handleCreateRequest = jest.fn()
  const handleUpdateRequest = jest.fn()
  const mocks = {
    request: {
      query: GuestListEntryQuery,
      variables: { id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761' }
    },
    result: {
      data: {
        result: {
          id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761',
          name: 'A new name',
          email: 'sample@gmail.com',
          phoneNumber: '309475834',
          nrc: '37348u53',
          vehiclePlate: null,
          reason: 'prospective_client',
          otherReason: null,
          concernFlag: null,
          grantedState: 0,
          createdAt: '2020-10-15T09:31:02Z',
          updatedAt: '2020-10-15T09:31:06Z',
          grantedAt: '2020-10-15T09:31:06Z',
          revokedAt: '2020-10-15T09:31:06Z',
          occursOn: ["monday"],
          visitEndDate: "2020-10-15T09:31:06Z",
          visitationDate: "2020-10-05T09:31:06Z",
          endTime: "2020-10-15T09:31:06Z",
          startTime: "2020-10-15T19:31:06Z",
          companyName: "",
          __typename: 'guestListEntryQuery'
        }
      }
    }
  };
  it('should render GuestRequestForm for guest entry update without error', async () => {
    const  container = render(
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <Context.Provider value={userMock}>
              <GuestRequestForm 
                id="3c2f8ee2-598b-437c-b217-3e4c0f86c761"
              />
            </Context.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(
      () => {
        const guestName = container.queryByTestId('guest_entry_user_name');
        fireEvent.change(guestName, { target: { value: 'Some User Name' } });
        expect(guestName.value).toBe('Some User Name');

        fireEvent.change(container.queryByTestId('guest_entry_user_nrc'), {
          target: { value: '100100/10/1' }
        });
        expect(container.queryByTestId('guest_entry_user_nrc').value).toBe('100100/10/1');

        fireEvent.change(container.queryByTestId('guest_entry_user_phone'), {
          target: { value: '100100' }
        });
        expect(container.queryByTestId('guest_entry_user_phone').value).toBe('100100');

        fireEvent.change(container.queryByTestId('guest_entry_user_vehicle'), {
          target: { value: 'ABT' }
        });
        expect(container.queryByTestId('guest_entry_user_vehicle').value).toBe('ABT');
      },
      { timeout: 50 }
    );


    expect(container.queryByText('logbook:guest_book.update_guest')).toBeInTheDocument();
    expect(container.queryByTestId('cancel_update_guest_btn')).toBeInTheDocument();
    
    fireEvent.click(container.queryByText('logbook:guest_book.update_guest'))
    await waitFor(() => {
      expect(handleUpdateRequest).not.toBeCalled()
    });

  });
  it('should render proper form when creating a new guest list entry', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Context.Provider value={userMock}>
              <GuestRequestForm />
            </Context.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByText('form_fields.full_name')).toBeInTheDocument();
      expect(container.queryByText('form_fields.email')).toBeInTheDocument();
      expect(container.queryByText('form_fields.nrc')).toBeInTheDocument();
      expect(container.queryByText('form_fields.phone_number')).toBeInTheDocument();
      expect(container.queryByText('form_fields.vehicle_plate_number')).toBeInTheDocument();
      expect(container.queryByText('form_fields.company_name')).toBeInTheDocument();
      expect(container.queryByText('logbook:logbook.visiting_reason')).toBeInTheDocument();
      expect(container.queryByText('form_actions.invite_guest')).toBeInTheDocument();
      const guestName = container.queryByTestId('guest_entry_user_name');
      fireEvent.change(guestName, { target: { value: 'Some User Name' } });
      expect(guestName.value).toBe('Some User Name');

      fireEvent.change(container.queryByTestId('guest_entry_user_nrc'), {
        target: { value: '100100/10/1' }
      });
      expect(container.queryByTestId('guest_entry_user_nrc').value).toBe('100100/10/1');

      fireEvent.change(container.queryByTestId('guest_entry_user_phone'), {
        target: { value: '100100' }
      });
      expect(container.queryByTestId('guest_entry_user_phone').value).toBe('100100');

      fireEvent.change(container.queryByTestId('guest_entry_user_vehicle'), {
        target: { value: 'ABT' }
      });
      expect(container.queryByTestId('guest_entry_user_vehicle').value).toBe('ABT');

      fireEvent.change(container.queryByTestId('email'), {
        target: { value: 'sample@gmail.com' }
      });
      expect(container.queryByTestId('email').value).toBe('sample@gmail.com');

      fireEvent.change(container.queryByTestId('guest_company_name'), {
        target: { value: 'sample company' }
      });
      expect(container.queryByTestId('guest_company_name').value).toBe('sample company');

      fireEvent.change(container.queryByTestId('guest_entry_visit_reason'), {
        target: { value: 'Sales' }
      });
      
      fireEvent.click(container.queryByLabelText('common:misc.day_of_visit'))

      // fireEvent.change(container.queryByTestId('date_picker_dialog'), {
      //   target: { value: '2021-12-21' }
      // });

    }, 50)


    fireEvent.click(container.queryByText('form_actions.invite_guest'))
    await waitFor(() => {
      expect(handleCreateRequest).not.toBeCalled()
    });

  })

});

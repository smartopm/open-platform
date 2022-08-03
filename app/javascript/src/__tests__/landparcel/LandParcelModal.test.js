/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';

import 'leaflet';
import 'leaflet-draw';
import LandParcelModal from '../../components/LandParcels/LandParcelModal';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

jest.mock('leaflet-draw');
describe('Land Property Modal Component', () => {
  it('should render tabs', () => {
    const props = {
      open: true,
      handleClose: jest.fn,
      modalType: 'new',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800'
      }
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <LandParcelModal {...props} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByText('property:dialog_headers.details')).toBeInTheDocument();
    expect(container.queryByText('property:dialog_headers.ownership')).toBeInTheDocument();
    expect(container.queryByText('property:dialog_headers.plan_history')).toBeInTheDocument();

    fireEvent.click(container.queryByText('property:dialog_headers.ownership'));
    expect(container.queryByText('property:buttons.new_owner')).toBeInTheDocument();

    fireEvent.click(container.queryByText('property:dialog_headers.plan_history'));

    fireEvent.click(container.queryByText('property:buttons.new_owner'));
    const ownerAddress = container.queryByTestId('owner-address');
    fireEvent.change(ownerAddress, { target: { value: 'Owner Address' } });
    expect(ownerAddress.value).toBe('Owner Address');
    expect(container.queryByTestId('owner')).toBeDefined();
  });

  it('should not allow adding new items if in "details" mode until edit-btn is clicked', () => {
    const props = {
      open: true,
      handleClose: jest.fn,
      modalType: 'details',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800',
        accounts: []
      },
      landParcels: []
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <LandParcelModal {...props} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByText('property:buttons.new_owner')).toBeNull();

    fireEvent.click(container.queryByText('property:form_actions.edit_property'));
    expect(container.queryByText('property:buttons.new_owner')).toBeInTheDocument();

    const parcelNumber = container.queryByTestId('parcel-number');
    fireEvent.change(parcelNumber, { target: { value: '12345' } });
    expect(parcelNumber.value).toBe('12345');
  });

  it('should show merge action dialog', async () => {
    const props = {
      open: true,
      handleClose: jest.fn,
      modalType: 'details',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800'
      },
      confirmMergeOpen: true
    };
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <LandParcelModal {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(container.getByText('property:messages.parcel_number_exists')).toBeTruthy();
    expect(container.getByText(/proceed/i)).toBeTruthy();
  });

  it('should close modal, skip merge when plots to merge both have accounts or payments', async () => {
    const props = {
      open: true,
      handleClose: jest.fn(),
      modalType: 'details',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800',
        accounts: [{ id: '123ghj', fullName: 'John' }],
        valuations: [],
        geom: null
      },
      confirmMergeOpen: true,
      landParcels: [
        {
          id: '1u2y3y4',
          parcelNumber: '15800',
          accounts: [{ id: '123ghj', fullName: 'Doe' }],
          valuations: [],
          geom: null
        }
      ]
    };
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <LandParcelModal {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(container.queryByText(/proceed/i)).toBeTruthy();
    const proceedButton = container.queryByText(/proceed/i);

    fireEvent.click(proceedButton);

    expect(props.handleClose).toHaveBeenCalled();
  });

  it('should close modal, skip merge when plots to merge both have geo-coordinates', async () => {
    const props = {
      open: true,
      handleClose: jest.fn(),
      modalType: 'details',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800',
        accounts: [],
        valuations: [],
        geom: '{type: "feature"}'
      },
      confirmMergeOpen: true,
      landParcels: [
        {
          id: '1u2y3y4',
          parcelNumber: '15800',
          accounts: [],
          valuations: [],
          geom: '{type: "feature"}'
        }
      ]
    };
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <LandParcelModal {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(container.queryByText(/proceed/i)).toBeTruthy();
    const proceedButton = container.queryByText(/proceed/i);

    fireEvent.click(proceedButton);

    expect(props.handleClose).toHaveBeenCalled();
  });

  it('should show merge modal when plots can be merged', async () => {
    const props = {
      open: true,
      handleClose: jest.fn(),
      modalType: 'details',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800',
        accounts: [{ id: '123ghj', fullName: 'John' }],
        valuations: [],
        geom: null
      },
      confirmMergeOpen: true,
      landParcels: [
        {
          id: '1u2y3y4',
          parcelNumber: '15800',
          accounts: [],
          valuations: [],
          geom: '{type: "feature"}'
        }
      ]
    };
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <LandParcelModal {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(container.queryByText(/proceed/i)).toBeTruthy();
    const proceedButton = container.queryByText(/proceed/i);

    fireEvent.click(proceedButton);

    expect(container.getByText('buttons.merge_and_save')).toBeInTheDocument();
    expect(container.getByText('messages.merge_properties')).toBeInTheDocument();
    expect(container.getAllByText('misc.selected_property')[0]).toBeInTheDocument();
    expect(container.getAllByText('misc.existing_property')[0]).toBeInTheDocument();
    expect(container.getAllByText('misc.merge_plot_to_keep')[0]).toBeInTheDocument();
    expect(container.getAllByText('misc.merge_plot_to_remove')[0]).toBeInTheDocument();
  });

  it('should render new house dialog', () => {
    const props = {
      open: true,
      handleClose: jest.fn,
      modalType: 'new_house',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800'
      }
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <LandParcelModal {...props} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByText('property:dialog_headers.details')).toBeInTheDocument();
    expect(container.queryByText('property:dialog_headers.ownership')).toBeInTheDocument();
    expect(container.queryByText('property:dialog_headers.plan_history')).toBeInTheDocument();
    expect(container.queryByText('property:dialog_headers.new_house')).toBeInTheDocument();

    expect(container.queryByTestId('status')).toBeDefined();
    expect(container.queryByTestId('object-type')).toBeDefined();
  });
});

/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { act, render, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import '@testing-library/jest-dom/extend-expect'
import 'leaflet'
import 'leaflet-draw'
import LandParcelModal from '../../components/LandParcels/LandParcelModal'

jest.mock('leaflet-draw')
describe('Land Property Modal Component', () => {
  it('it should render tabs', () => {
    const props = {
      open: true,
      handleClose: jest.fn,
      modalType: 'new',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800'
      }
    }
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <LandParcelModal {...props} />
        </BrowserRouter>
      </MockedProvider>)

    expect(container.queryByText('Details')).toBeInTheDocument()
    expect(container.queryByText('Ownership')).toBeInTheDocument()
    expect(container.queryByText('Valuation History')).toBeInTheDocument()

    fireEvent.click(container.queryByText('Ownership'))
    expect(container.queryByText('New Owner')).toBeInTheDocument()

    fireEvent.click(container.queryByText('Valuation History'))
    expect(container.queryByText('Add Valuation')).toBeInTheDocument()

    fireEvent.click(container.queryByText('Add Valuation'))
    const valuationAmount = container.queryByTestId('valuation-amount')
    fireEvent.change(valuationAmount, { target: { value: 200 } })
    expect(valuationAmount.value).toBe('200')

    fireEvent.click(container.queryByText('New Owner'))
    const ownerAddress = container.queryByTestId('owner-address')
    fireEvent.change(ownerAddress, { target: { value: 'Owner Address' } })
    expect(ownerAddress.value).toBe('Owner Address')
    expect(container.queryByTestId("owner")).toBeDefined();
  })

  it('it should not allow adding new items if in "details" mode until edit-btn is clicked', () => {
    const props = {
      open: true,
      handleClose: jest.fn,
      modalType: 'details',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800'
      }
    }
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <LandParcelModal {...props} />
        </BrowserRouter>
      </MockedProvider>)

    expect(container.queryByText('Add Valuation')).toBeNull()
    expect(container.queryByText('New Owner')).toBeNull()

    fireEvent.click(container.queryByText('Edit Property'))
    expect(container.queryByText('Add Valuation')).toBeInTheDocument()
    expect(container.queryByText('New Owner')).toBeInTheDocument()

    const parcelNumber = container.queryByTestId('parcel-number')
    fireEvent.change(parcelNumber, { target: { value: '12345' } })
    expect(parcelNumber.value).toBe('12345')
  })

  it('should show merge action dialog', async () => {
    const props = {
      open: true,
      handleClose: jest.fn,
      modalType: 'details',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800'
      },
      confirmMergeOpen: true,
    }
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <LandParcelModal {...props} />
          </BrowserRouter>
        </MockedProvider>)
    })

    expect(container.getByText(/parcel number already exists. do you want to merge/gi)).toBeTruthy()
    expect(container.getByText(/proceed/i)).toBeTruthy()
  });

  it('should close modal, skip merge when plots to merge both have accounts or payments', async () => {
    const props = {
      open: true,
      handleClose: jest.fn(),
      modalType: 'details',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800',
        accounts: [{fullName: 'John'}],
        valuations: [],
        geom: null,
      },
      confirmMergeOpen: true,
      landParcels: [
        {
          id: '1u2y3y4',
          parcelNumber: '15800',
          accounts: [{fullName: 'Doe'}],
          valuations: [],
          geom: null,
        }
      ]
    }
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <LandParcelModal {...props} />
          </BrowserRouter>
        </MockedProvider>)
    })

    expect(container.queryByText(/proceed/i)).toBeTruthy()
    const proceedButton = container.queryByText(/proceed/i)

    fireEvent.click(proceedButton)

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
        geom: '{type: "feature"}',
      },
      confirmMergeOpen: true,
      landParcels: [
        {
          id: '1u2y3y4',
          parcelNumber: '15800',
          accounts: [],
          valuations: [],
          geom: '{type: "feature"}',
        }
      ]
    }
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <LandParcelModal {...props} />
          </BrowserRouter>
        </MockedProvider>)
    })

    expect(container.queryByText(/proceed/i)).toBeTruthy()
    const proceedButton = container.queryByText(/proceed/i)

    fireEvent.click(proceedButton)

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
        accounts: [{fullName: 'John'}],
        valuations: [],
        geom: null,
      },
      confirmMergeOpen: true,
      landParcels: [
        {
          id: '1u2y3y4',
          parcelNumber: '15800',
          accounts: [],
          valuations: [],
          geom: '{type: "feature"}',
        }
      ]
    }
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <LandParcelModal {...props} />
          </BrowserRouter>
        </MockedProvider>)
    })

    expect(container.queryByText(/proceed/i)).toBeTruthy()
    const proceedButton = container.queryByText(/proceed/i)
    
    fireEvent.click(proceedButton)
    
    expect(container.getByText(/merge and save/i)).toBeInTheDocument()
    expect(container.getByText(/you are about to merge these two properties!/i)).toBeInTheDocument()
    expect(container.getAllByText(/selected/i)[0]).toBeInTheDocument()
    expect(container.getAllByText(/existing/i)[0]).toBeInTheDocument()
    expect(container.getAllByText(/plot to keep/i)[0]).toBeInTheDocument()
    expect(container.getAllByText(/plot to remove/i)[0]).toBeInTheDocument()
  });
})
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import 'leaflet'
import 'leaflet-draw'
import LandParcelPage from '../../containers/LandParcels/LandParcel';
import LandParcelList from '../../components/LandParcels/LandParcel';
import '@testing-library/jest-dom/extend-expect';
import { LandParcel as LandParcelQuery, ParcelsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
jest.mock('leaflet-draw')
describe('Land Property Page', () => {
  it('renders land parcel page', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <LandParcelPage />
        </BrowserRouter>
      </MockedProvider>
    );
  });

  it('should test for landparcel queries', async () => {
    const mock = {
      id: '342bbccf-4899-47eb-922c-962484d0c41d',
      parcelNumber: 'Basic-664354',
      address1: 'Lagos drive',
      address2: '232 Street Av',
      city: 'Lagos',
      postalCode: '1010101',
      stateProvince: 'LaLagos',
      country: 'EAC Country',
      parcelType: '232',
      plotSold: true,
      latY: null,
      longX: null,
      geom: null,
      createdAt: '2021-02-04T09:02:06Z',
      accounts: [],
      paymentPlans: []
    };
    const landParcelMock = [
      {
        request: {
          query: ParcelsQuery,
          variables: { query: '', limit: 20, offset: 0 }
        },
        result: {
          data: {
            fetchLandParcel: [mock]
          }
        }
      },
      {
        request: {
          query: LandParcelQuery,
          variables: { id: 'someser_idsd' }
        },
        result: {
          data: {
            landParcel: mock
          }
        }
      }
    ];
    const container = render(
      <MockedProvider mocks={landParcelMock} addTypename={false}>
        <BrowserRouter>
          <LandParcelList />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('New Property')).toBeInTheDocument()

    const loader = render(<Spinner />);
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText("EAC Country")).toBeInTheDocument()
        expect(container.queryByText("LaLagos")).toBeInTheDocument()
        expect(container.queryByText("Lagos drive")).toBeInTheDocument()
        expect(container.queryByText("Basic-664354")).toBeInTheDocument()
        expect(container.queryByText("232")).toBeInTheDocument()
        expect(container.queryByText("232 Street Av")).toBeInTheDocument()
      },
      { timeout: 100 }
    );
  });
});

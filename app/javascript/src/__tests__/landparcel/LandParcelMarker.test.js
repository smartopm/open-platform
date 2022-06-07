import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import LandParcelMarker from '../../components/Map/LandParcelMarker'
import MockedThemeProvider from '../../modules/__mocks__/mock_theme'

describe('<LandParcelMarker />', () => {
  it('should render marker correctly when plot not sold', async () => {
    const markerProps = {
      parcelNumber: '1234',
      parcelType: 'basic',
      geoLongX: 28.6530035716,
      geoLatY: -15.5096758256,
      plotSold: false,
    }
     render(
       <MockedProvider>
         <BrowserRouter>
           <MockedThemeProvider>
             <LandParcelMarker markerProps={markerProps} />
           </MockedThemeProvider>
         </BrowserRouter>
       </MockedProvider>
      )

    await waitFor(() => {
      expect(screen.queryByTestId('unknown-property')).toBeInTheDocument()
      expect(screen.queryByTestId('property-details-section')).toBeInTheDocument()
      expect(screen.queryByTestId('property-number')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.property_no/i)).toBeInTheDocument()
      expect(screen.getByText(/1234/)).toBeInTheDocument()
      expect(screen.queryByTestId('property-type')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.property_type/i)).toBeInTheDocument()
      expect(screen.getByText(/basic/i)).toBeInTheDocument()
      expect(screen.queryByTestId('property-latY')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.latitude_y/i)).toBeInTheDocument()
      expect(screen.getByText(/-15/)).toBeInTheDocument()
      expect(screen.queryByTestId('property-longX')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.longitude_x/i)).toBeInTheDocument()
      expect(screen.getByText(/28/)).toBeInTheDocument()
    }, 10)

  })

  it('should render marker correctly when plot is sold', async () => {
    const markerProps = {
      parcelNumber: '1234',
      parcelType: 'basic',
      geoLongX: 28.6530035716,
      geoLatY: -15.5096758256,
      plotSold: true,
    }
     render(
       <MockedProvider>
         <BrowserRouter>
           <MockedThemeProvider>
             <LandParcelMarker markerProps={markerProps} />
           </MockedThemeProvider>
         </BrowserRouter>
       </MockedProvider>
      )

    await waitFor(() => {
      expect(screen.queryByTestId('sold-property')).toBeInTheDocument()
      expect(screen.queryByTestId('property-details-section')).toBeInTheDocument()
      expect(screen.queryByTestId('property-number')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.property_no/i)).toBeInTheDocument()
      expect(screen.getByText(/1234/)).toBeInTheDocument()
      expect(screen.queryByTestId('property-type')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.property_type/i)).toBeInTheDocument()
      expect(screen.getByText(/basic/i)).toBeInTheDocument()
      expect(screen.queryByTestId('property-latY')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.latitude_y/i)).toBeInTheDocument()
      expect(screen.getByText(/-15/)).toBeInTheDocument()
      expect(screen.queryByTestId('property-longX')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.longitude_x/i)).toBeInTheDocument()
      expect(screen.getByText(/28/)).toBeInTheDocument()
    }, 10)

  })

  
  it('should render marker correctly for houses', async () => {
    const houseMarkerProps = {
      parcelNumber: 'House1234',
      geoLongX: 28.6530035716,
      geoLatY: -15.5096758256,
      status: 'Planned',
      plotSold: false
    }
     render(
       <MockedProvider>
         <BrowserRouter>
           <MockedThemeProvider>
             <LandParcelMarker markerProps={houseMarkerProps} category="house" />
           </MockedThemeProvider>
         </BrowserRouter>
       </MockedProvider>
      )

    await waitFor(() => {
      expect(screen.queryByTestId('property-details-section')).toBeInTheDocument()
      expect(screen.queryByTestId('property-number')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.property_no/i)).toBeInTheDocument()
      expect(screen.getByText(/House1234/)).toBeInTheDocument()
      expect(screen.queryByTestId('house-status')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.house_status/i)).toBeInTheDocument()
      expect(screen.getByText(/Planned/i)).toBeInTheDocument()
      expect(screen.queryByTestId('property-latY')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.latitude_y/i)).toBeInTheDocument()
      expect(screen.getByText(/-15/)).toBeInTheDocument()
      expect(screen.queryByTestId('property-longX')).toBeInTheDocument()
      expect(screen.getByText(/map_markers.longitude_x/i)).toBeInTheDocument()
      expect(screen.getByText(/28/)).toBeInTheDocument()
    }, 10)

  })
})

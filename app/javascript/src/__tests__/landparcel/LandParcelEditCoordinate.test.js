/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { act, render } from '@testing-library/react'
// import LandParcelEditCoordinate from '../../components/LandParcels/LandParcelEditCoordinate'

describe.skip('LandParcelEditCoordinate', () => {
  it('should mount component correctly', async () => {
    const props = {
      handleSaveMapEdit: jest.fn(),
      handleClose: jest.fn(),
      open: false,
    }

    let container;
    
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <LandParcelEditCoordinate 
              handleSaveMapEdit={props.handleSaveMapEdit} 
              handleClose={props.handleClose}
              open={props.open}
            />
          </BrowserRouter>
        </MockedProvider>
      )
    })

    expect(container.queryByTestId('leaflet-map-container')).toBeTruthy()
  });
});
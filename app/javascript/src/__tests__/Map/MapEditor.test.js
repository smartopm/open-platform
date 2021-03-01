/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { act, render } from '@testing-library/react'
import 'leaflet'
import 'leaflet-draw'
import MapEditor from '../../components/Map/MapEditor'

jest.mock('leaflet-draw')
describe('MapEditor', () => {
  it('should mount component correctly', async () => {
    const props = {
      handleSaveMapEdit: jest.fn(),
    }

    let container;
    
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <MapEditor 
              handleSaveMapEdit={props.handleSaveMapEdit}
            />
          </BrowserRouter>
        </MockedProvider>
      )
    })

    expect(container.queryByTestId('leaflet-map-container')).toBeTruthy()
  });
});
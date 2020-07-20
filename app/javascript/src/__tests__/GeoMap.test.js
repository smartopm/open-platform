import React from 'react'
import GeoMap from '../components/Map/GeoMap'
import GeoData from "../data/nkwashi_plots.json"
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'

describe("Render Map based on Geo data",()=>{
    it('should render map with plots',()=>{
        jest.mock('../__mocks__/leaflet')
        render(
            <BrowserRouter>
                <GeoMap GeoJSONData={GeoData.features} />
            </BrowserRouter>
        )
    })
})

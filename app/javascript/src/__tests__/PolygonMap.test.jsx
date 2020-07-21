import React from 'react'
import Polygon from '../components/Map/PolygonMap'
import GeoData from "../data/nkwashi_geo.json"
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'

describe("Render Map based on Geo data",()=>{
    it('should render map with plots',()=>{
        jest.mock('../__mocks__/leaflet')
        render(
            <BrowserRouter>
                <Polygon GeoJSONData={GeoData.features} />
            </BrowserRouter>
        )
    })
})

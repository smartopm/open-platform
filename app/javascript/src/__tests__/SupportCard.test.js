import React from 'react';
import Support from '../components/SupportCard'
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'

describe("Support card loads component",()=>{

    it('should render support card',()=>{
        const { getByText } = render(
            <BrowserRouter>
              <Support/>
            </BrowserRouter>
          )
            expect(getByText('support@doublegdp.com')).toBeInTheDocument()
            expect(getByText('+260 976 261199')).toBeInTheDocument() 
    })
    it('should render support chart',()=>{
        const { getByText } = render(
            <BrowserRouter>
              <Support/>
            </BrowserRouter>
          )
            expect(getByText('Support Chat')).toBeInTheDocument()
    })
})


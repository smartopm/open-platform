import React from 'react'
import Events from '../components/Events'
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

describe("Should Render Events Component",()=>
{
    const data = {
        result : [
            {
                id : "1",
                subject : "user_active",
                description : "	User Yoram Gondwe was active",      
                createdAt : new Date(),      
                timestamp : new Date(),  
            },
            {
                id : "2",
                subject : "user_active",
                description : "	User Yoram Gondwe was active",      
                createdAt : new Date(),      
                timestamp : new Date(),  
            },
            
        ]
    }
    it(" shoudl render tabel titles",()=>{
        const {getByText} = render(
            <MockedProvider mock={[]} >
              <BrowserRouter>
                <Events data = {data}/>
            </BrowserRouter>
            </MockedProvider>
        )
        expect(getByText('Subject')).toBeInTheDocument()
        expect(getByText('Description')).toBeInTheDocument() 
    })
})
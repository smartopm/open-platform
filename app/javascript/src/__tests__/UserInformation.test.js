import React from 'react'
import UserInformation from '../components/UserInformation'
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

describe("User infromation component loads",()=>{
    const data = {
        user : {
            id : "1",
            name : "Yoram",
            state : "Valid",      
        }
    }
    const authstate = {
        user:{
            userType : "admin"
        }
    }
    it('should render user name',()=>{
        const {getByText} = render(
            <MockedProvider mock={[]} >
              <BrowserRouter>
                <UserInformation
                data ={data}
                authState ={authstate}
                />
            </BrowserRouter>
            </MockedProvider>
        )
        expect(getByText('Yoram')).toBeInTheDocument()
        expect(getByText('Valid')).toBeInTheDocument() 
    })    
    it('should render tab elemets',()=>{
        const {getByText} = render(
            <MockedProvider mock={[]} >
              <BrowserRouter>
                <UserInformation
                data ={data}
                authState ={authstate}
                />
            </BrowserRouter>
            </MockedProvider>
        )
        expect(getByText('Plots')).toBeInTheDocument()
        expect(getByText('Payments')).toBeInTheDocument()
        expect(getByText('Send SMS to Yoram')).toBeInTheDocument()
        expect(getByText('Contact')).toBeInTheDocument() 
    })

})
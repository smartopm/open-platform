import React from 'react'
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import UserInformation from '../components/UserInformation'

describe("User infromation component loads",()=>{
    const data = {
        user : {
            id : "1",
            name : "Yoram",
            state : "Valid", 
            userType : "admin"     
        }
    }
    const authstate = {
        user:{
            userType : "admin"
        }
    }
    it('should render user name on contacts tab',()=>{
        const {getByText} = render(
          <MockedProvider mock={data}>
            <BrowserRouter>
              <UserInformation
                data={data}
                authState={authstate}
              />
            </BrowserRouter>
          </MockedProvider>
        )
        expect(getByText('Yoram')).toBeInTheDocument()
        expect(getByText('Valid')).toBeInTheDocument() 
    })    
    it('should render tab elemets',()=>{
        const {getByText} = render(
          <MockedProvider mock={data}>
            <BrowserRouter>
              <UserInformation
                data={data}
                authState={authstate}
              />
            </BrowserRouter>
          </MockedProvider>
        )
        expect(getByText('Plots')).toBeInTheDocument()
        expect(getByText('Communication')).toBeInTheDocument()
        expect(getByText('Payments')).toBeInTheDocument() 
        expect(getByText('Contact')).toBeInTheDocument() 
    })
    it('should render Comming soon',()=>{
        const {getByText} = render(
          <MockedProvider mock={data}>
            <BrowserRouter>
              <UserInformation
                data={data}
                authState={authstate}
              />
            </BrowserRouter>
          </MockedProvider>
        )
        expect(getByText('Coming soon')).toBeInTheDocument()
    })
    it('should render Menue',()=>{
        const {getByText} = render(
          <MockedProvider mock={data}>
            <BrowserRouter>
              <UserInformation
                data={data}
                authState={authstate}
              />
            </BrowserRouter>
          </MockedProvider>
        )
        expect(getByText('Print')).toBeInTheDocument()
        expect(getByText('Send One Time Passcode')).toBeInTheDocument()
        expect(getByText('Message Support')).toBeInTheDocument()
    })

})
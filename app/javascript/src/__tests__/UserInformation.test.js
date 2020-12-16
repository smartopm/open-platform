import React from 'react'
import { render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import UserInformation from '../components/UserInformation'

describe("User information component loads",()=>{
    const data = {
        user : {
            id : "1",
            name : "Yoram",
            state : "Valid",
            userType : "admin",
            formUsers: []
        }
    }

    const accountData = {
      user : {
        accounts : [{
          id: "jlklkwe",
          updatedAt: "2020-10-21T06:23:12Z",
          landParcels: [{
            id: "c9de32f7-ad64-41ed-9c05-79d85d088b1b",
            parcelNumber: "las"
          }]
        }]
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
                accountData={accountData}
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
                accountData={accountData}
              />
            </BrowserRouter>
          </MockedProvider>
        )
        expect(getByText('Plots')).toBeInTheDocument()
        expect(getByText('Communication')).toBeInTheDocument()
        expect(getByText('Payments')).toBeInTheDocument()
        expect(getByText('Contact')).toBeInTheDocument()
    })
    it('should render invoice button',()=>{
        const {queryByTestId} = render(
          <MockedProvider mock={data}>
            <BrowserRouter>
              <UserInformation
                data={data}
                authState={authstate}
                accountData={accountData}
              />
            </BrowserRouter>
          </MockedProvider>
        )
        expect(queryByTestId('invoice-button')).toBeInTheDocument()
    })
    it('should render Menue',()=>{
        const {getByText} = render(
          <MockedProvider mock={data}>
            <BrowserRouter>
              <UserInformation
                data={data}
                authState={authstate}
                accountData={accountData}
              />
            </BrowserRouter>
          </MockedProvider>
        )
        expect(getByText('Print')).toBeInTheDocument()
        expect(getByText('Send One Time Passcode')).toBeInTheDocument()
        expect(getByText('Message Support')).toBeInTheDocument()
    })

})

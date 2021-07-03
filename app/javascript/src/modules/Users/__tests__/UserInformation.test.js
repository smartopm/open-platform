import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import UserInformation from '../Components/UserInformation'
import MockedThemeProvider from '../../__mocks__/mock_theme'

describe("User information component loads",()=>{
    const data = {
        user : {
            id : "1",
            name : "Yoram",
            state : "Valid",
            userType : "admin",
            formUsers: [],
            substatusLogs: [],
        }
    }

    const parcelData = [
      {
        id: 'hiuwkeh',
        parcelNumber: 'ho2ij3',
        updatedAt: "2020-10-20T06:23:12Z",
      }
  ]

    const accountData = {
      user : {
        accounts : [{
          id: "jlklkwe",
          updatedAt: "2020-10-21T06:23:12Z",
          landParcels: [{
            id: "c9de32f7-ad64-41ed-9c05-79d85d088b1b",
            parcelNumber: "las",
            updatedAt: "2020-10-22T06:23:12Z",
          }]
        }]
      }
    }
    const authstate = {
        user:{
            userType : "admin",
            community: {
              currency: 'zambian_kwacha',
              features: ["Tasks", "Messages", "Payments", "Properties"]
            }
        }
    }
    it('should render user name on contacts tab', async ()=>{
      const mock = jest.fn()
      const routeMock = {
        push: mock
      }
        const {getByText} = render(
          <MockedProvider mock={data}>
            <BrowserRouter>
              <MockedThemeProvider>
                <UserInformation
                  data={data}
                  authState={authstate}
                  accountData={accountData}
                  parcelData={parcelData}
                  onLogEntry={mock}
                  sendOneTimePasscode={mock}
                  refetch={mock}
                  userId={data.user.id}
                  router={routeMock}
                  accountRefetch={mock}
                />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        )
        await waitFor(
          () => { expect(getByText('Yoram')).toBeInTheDocument()
                  expect(getByText('common:user_types.admin')).toBeInTheDocument() },
          { timeout: 50 }
        )
    })
})

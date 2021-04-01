import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import UserInformation from '../components/UserInformation'
import { UserActivePlanQuery } from '../graphql/queries/user'

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
        parcelNumber: 'ho2ij3'
      }
  ]

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
            userType : "admin",
            community: {
              currency: 'zambian_kwacha'
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
            </BrowserRouter>
          </MockedProvider>
        )
        await waitFor(
          () => { expect(getByText('Yoram')).toBeInTheDocument()
                  expect(getByText('Valid')).toBeInTheDocument() },
          { timeout: 50 }
        )
    })
    it('should render tab elemets', async () => {
      const anotherMock = {
        request: {
          query: UserActivePlanQuery
        },
        result: {
          data: {
            userActivePlan: true
          }
        }
      };
      const { getAllByText } = render(
        <MockedProvider mocks={[anotherMock]}>
          <BrowserRouter>
            <UserInformation
              data={data}
              authState={authstate}
              accountData={accountData}
              parcelData={parcelData}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      await waitFor(
        () => {
          expect(getAllByText('Plots')[0]).toBeInTheDocument();
          expect(getAllByText('Communication')[0]).toBeInTheDocument();
          expect(getAllByText('Payments')[0]).toBeInTheDocument();
          expect(getAllByText('Contact')[0]).toBeInTheDocument();
        },
        { timeout: 50 }
      );
    });

    it('should render Menue', async ()=>{
        const {getByText} = render(
          <MockedProvider mock={data}>
            <BrowserRouter>
              <UserInformation
                data={data}
                authState={authstate}
                accountData={accountData}
                parcelData={parcelData}
              />
            </BrowserRouter>
          </MockedProvider>
        )

        await waitFor(
          () => { expect(getByText('Print')).toBeInTheDocument()
          expect(getByText('Send One Time Passcode')).toBeInTheDocument()
          expect(getByText('Message Support')).toBeInTheDocument() },
          { timeout: 50 }
        )

    })

})

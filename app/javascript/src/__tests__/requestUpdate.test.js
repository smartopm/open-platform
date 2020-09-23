import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import RequestUpdate from '../containers/Requests/RequestUpdate'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe("RequestUpdate Component ",() => {

  const match = {
    params: {
      id: "hiue7727gjkwhejk"
    }
  }
  const history = jest.fn()
  const location = jest.fn()
  it('should render RequestUpdate page without error',()=> {
     const container =  render(
       <MockedProvider>
         <BrowserRouter>
           <RequestUpdate match={match} history={history} location={location} />
         </BrowserRouter>
       </MockedProvider>
     )

    expect(container.getByTestId('loader')).toBeInTheDocument()
  })
})

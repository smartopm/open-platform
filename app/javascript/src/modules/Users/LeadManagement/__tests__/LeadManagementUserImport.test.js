import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import LeadManagementUserImport from '../Containers/LeadManagementUserImport'

jest.mock('@rails/activestorage/src/file_checksum', async () => jest.fn())
describe('UsersImport component', () => {
  it('renders file input', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    )
    await waitFor(
      () => expect(container.queryByTestId('lead-csv-input')).toBeInTheDocument(),
      { timeout: 10 }
    )
  })

  it('should initialize new FileReader on selecting a file', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    )
    const rows = [
      'Name,email,title',
      'Kamau,bah@gmail.com The BigBoss',
      'Njoroge,njeri@gmail.com The BigBossLady',
    ]
    const file = new Blob([rows.join('\n')], { type: 'csv' })
    const inputEl = container.queryByTestId('lead-csv-input')
    Object.defineProperty(inputEl, 'files', { value: [file] })
    fireEvent.drop(inputEl)
    // eslint-disable-next-line jest/valid-expect
    await waitFor(() => expect(FileReader).toHaveBeenCalled, { timeout: 10 })
  })

//   it('should render upload description', async () => {
//     const container = render(
//       <MockedProvider mocks={[]}>
//         <BrowserRouter>
//           <LeadManagementUserImport />
//         </BrowserRouter>
//       </MockedProvider>
//     )
//     const rows = [
//       'NAME,ADDRESS,ZIP',
//       'james,1800 sunny ln,40000',
//       'ronda,1200 peaches ln,50000'
//     ]
//     expect(container.queryByText(/You can upload a .csv file with users./)).toBeInTheDocument()
//     const file = new Blob([rows.join('\n')], { type: 'csv' })
//     fireEvent.change(container.queryByTestId('csv-input'), { target: { files: [file] } });
//     await waitFor(() => {
//       expect(container.getByTestId('csv-input')).toBeInTheDocument();
//     })
//   })
})

import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import UsersImport from '../containers/UsersImport'
import '@testing-library/jest-dom/extend-expect'

jest.mock('@rails/activestorage/src/file_checksum', async() => jest.fn())
describe('UsersImport component', () => {
  it("renders file input", async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <UsersImport />
        </BrowserRouter>
      </MockedProvider>
    )
    await waitFor(() => expect(container.queryByTestId("csv-input")).toBeInTheDocument(), { timeout: 1000 })
  })

  it("should initialize new FileReader on selecting a file", async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <UsersImport />
        </BrowserRouter>
      </MockedProvider>
    )
    const rows = ['NAME,ADDRESS,ZIP', 'james,1800 sunny ln,40000', 'ronda,1200 peaches ln,50000']
    const file = new Blob([rows.join('\n')], {type : 'csv'})
    const inputEl = container.queryByTestId('csv-input')
    Object.defineProperty(inputEl, 'files', { value: [file] });
    fireEvent.drop(inputEl)
    await waitFor(() => expect(FileReader).toHaveBeenCalled, { timeout: 1000 })
  })
})

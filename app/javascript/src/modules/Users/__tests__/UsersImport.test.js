import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import UsersImport from '../Containers/UsersImport'

jest.mock('@rails/activestorage/src/file_checksum', async () => jest.fn())
describe('UsersImport component', () => {
  it('renders file input', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <UsersImport />
        </BrowserRouter>
      </MockedProvider>
    )
    await waitFor(
      () => expect(container.queryByTestId('csv-input')).toBeInTheDocument(),
      { timeout: 10 }
    )
  })

  it('should initialize new FileReader on selecting a file', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <UsersImport />
        </BrowserRouter>
      </MockedProvider>
    )
    const rows = [
      'NAME,ADDRESS,ZIP',
      'james,1800 sunny ln,40000',
      'ronda,1200 peaches ln,50000'
    ]
    const file = new Blob([rows.join('\n')], { type: 'csv' })
    const inputEl = container.queryByTestId('csv-input')
    Object.defineProperty(inputEl, 'files', { value: [file] })
    fireEvent.drop(inputEl)
    await waitFor(() => expect(FileReader).toHaveBeenCalled, { timeout: 10 })
  })

  it('should render upload description', () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <UsersImport />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText(/You can upload a .csv file with users./)).toBeInTheDocument()
  })
})

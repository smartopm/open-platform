import React from 'react'
import { render, cleanup, queryByAttribute } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { MemoryRouter } from 'react-router-dom'
import UserShow from '../modules/Users/Containers/UserShow'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Should check if the buttons are functional', () => {
  it('should render the buttons', async () => {
    const getById = queryByAttribute.bind(null, 'id')

    const dom = render(
      <MockedProvider>
        <MemoryRouter>
          <UserShow />
        </MemoryRouter>
      </MockedProvider>
    )

    getById(dom.container, 'log-entry')
    getById(dom.container, 'call_poniso')
  })

  afterEach(cleanup)
})

import React from 'react'
import { render } from '@testing-library/react'
import { IndexComponent } from '../containers/Requests/EntryRequests'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('entry request list', () => {
  it('should render correct data', () => {
    const data = {
      result: [
        {
          id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761',
          name: 'A new name',
          phoneNumber: '309475834',
          nrc: '37348u53',
          vehiclePlate: null,
          reason: 'Prospective Client',
          otherReason: null,
          concernFlag: null,
          grantedState: 1,
          createdAt: '2020-10-15T09:31:02Z',
          updatedAt: '2020-10-15T09:31:06Z',
          grantedAt: '2020-10-15T09:31:06Z',
          user: {
            name: 'Some User Name',
            id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
          },
          guard: {
            name: 'Some Guard Name',
            id: '2f9-b2d0-a83a16d59569'
          }
        }
      ]
    }
    const container = render(<IndexComponent data={data} />)
    expect(container.queryAllByTestId('entry_row')).toHaveLength(1)
    expect(container.queryByTestId('entry_name').textContent).toContain('A new name')
    expect(container.queryByTestId('entry_phone').textContent).toContain('309475834')
    expect(container.queryByTestId('entry_nrc').textContent).toContain('37348u53')
    expect(container.queryByTestId('entry_guard').textContent).toContain('Some Guard Name')
    expect(container.queryByTestId('entry_reason').textContent).toContain('Prospective Client')
  })
})

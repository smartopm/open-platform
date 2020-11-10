import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
import QueryBuilder from '../components/QueryBuilder'

const InitialConfig = MaterialConfig
const queryBuilderConfig = {
  ...InitialConfig,
  fields: {
    role: {
      label: 'Role',
      type: 'select',
      fieldSettings: {
        listValues: []
      }
    }
  }
}

const queryBuilderInitialValue = {
  id: '99a8a9ba-0123-3344-c56d-b16e532c8cd0',
  type: 'group',
  children1: {
    '11b8a9ba-0123-4456-b89a-b16e721c8cd0': {
      type: 'rule',
      properties: {
        field: 'role',
        operator: 'select_equals',
        value: [''],
        valueSrc: ['value'],
        valueType: ['select']
      }
    }
  }
}

describe('QueryBuilder component', () => {
  it('should render necessary filter fields', () => {
    const props = {
      builderConfig: queryBuilderConfig,
      initialQueryValue: queryBuilderInitialValue,
      filterFields: {},
      handleOnChange: jest.fn
    }

    const rendered = render(<QueryBuilder {...props} />)
    expect(rendered.queryByText('Role')).toBeInTheDocument()
  })
})
import React from 'react';
import { render } from '@testing-library/react';

import MuiConfig from 'react-awesome-query-builder/lib/config/mui';
import QueryBuilder from '../components/QueryBuilder';
import { Context } from '../containers/Provider/AuthStateProvider';
import userMock from '../__mocks__/userMock';

const InitialConfig = MuiConfig;
const queryBuilderConfig = {
  ...InitialConfig,
  fields: {
    role: {
      label: 'Role',
      type: 'select',
      fieldSettings: {
        listValues: [{ value: '', title: '' }]
      }
    }
  }
};

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
};

describe('QueryBuilder component', () => {
  it('should render necessary filter fields', () => {
    const props = {
      builderConfig: queryBuilderConfig,
      initialQueryValue: queryBuilderInitialValue,
      filterFields: {},
      handleOnChange: jest.fn
    };

    const rendered = render(
      <Context.Provider value={userMock}>
        <QueryBuilder {...props} addRuleLabel="Add Filter" />
      </Context.Provider>
    );
    expect(rendered.queryByText('Add Filter')).toBeInTheDocument();
  });
});

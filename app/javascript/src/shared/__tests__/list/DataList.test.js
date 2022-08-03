import React from 'react';
import { render } from '@testing-library/react'

import DataList, { MobileCellData } from "../../list/DataList";


describe('Data List', () => {
  const headers = [
    { title: 'title', col: 2 }
  ];

  const anotherHeader = [
    { title: 'menu', col: 2 }
  ];
  it('should render correctly', () => {
      const container = render(
        <DataList
          keys={headers}
          data={[{title: 'Hello'}]}
          hasHeader
          clickable
          handleClick={jest.fn}
        />)
      expect(container.queryByText('Hello')).toBeInTheDocument()
  })

  it('should return error when data not present', () => {
    const container = render(
      <DataList
        keys={headers}
        data={[]}
        hasHeader={false}
      />)
    expect(container.queryByText('No Data')).toBeInTheDocument()
  })

  it('should test MobileCellData', () => {
    const container = render(
      <MobileCellData
        propNames={anotherHeader}
        dataObj={{menu: 'menu'}}
        singlePropName={{status: true, value: 'menu'}}
      />)
    expect(container.queryByText('menu')).toBeInTheDocument()
  })
})
import React from 'react'
import { mount } from 'enzyme'
import DataTable from '../components/DataTable'

describe('test the datatabe', () => {

    const dataProps =
    {
        columns: [
            { id: 'name', label: 'Name', minWidth: 170 },
            { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
            
        ],
        sticky: true
    }

    it('It should render', () => {

        const wrapper = mount(<DataTable {...dataProps} />)
        expect(wrapper.find('div'))
        expect(wrapper.find('table'))
        
    })
    const dataPropsView= mount(<DataTable {...dataProps} />)
    it('columns should not be null', () => {
        const {columns, sticky} = dataPropsView.props()
        expect.arrayContaining(columns)
        expect(sticky).toBe(true)
    });
    

})
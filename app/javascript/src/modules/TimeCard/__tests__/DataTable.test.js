import React from 'react'
import { mount } from 'enzyme'
import DataTable from '../Components/DataTable'

describe('test the datatabe', () => {

    const dataProps =
    {
        columns: ['Name', 'Code'],
        sticky: true
    }
    it('should render', () => {

        const wrapper = mount(<DataTable {...dataProps} />)
        expect(wrapper.find('div')).toBeTruthy()
        expect(wrapper.find('table')).toHaveLength(1)
        
    })
    const dataPropsView= mount(<DataTable {...dataProps} />)
    it('columns should not be null', () => {
        const {columns, sticky} = dataPropsView.props()
        expect(columns).toContain('Name')
        expect(sticky).toBe(true)
    });
    

})
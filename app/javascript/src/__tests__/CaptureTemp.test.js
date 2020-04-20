import React from 'react'
import { mount } from 'enzyme'
import CaptureTemp from '../components/CaptureTemp'



describe('temperature component', () => {
    it('component is mounted', ()=>{
        const wrapper = mount(<CaptureTemp />)
        expect(wrapper.find('.button'))
    })
    it('It should get the temperature value', () => {
        const screenProps= {
            handleClick: jest.fn(),
            handleTempInput: jest.fn()
        }
        const wrapper = mount(<CaptureTemp {...screenProps}/>)
        wrapper.find('button').simulate('click')
        const value = wrapper.find('.tempvalue')
        expect(value).toBe(value>0)
        
    })
});

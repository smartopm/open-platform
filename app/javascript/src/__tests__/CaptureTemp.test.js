import React from 'react'
import { shallow } from 'enzyme'
import CaptureTemp from '../components/CaptureTemp'



describe('temperature component', () => {
    it('component is mounted', () => {
        const wrapper = shallow(<CaptureTemp />)
        expect(wrapper.find('.button'))
    })

    const screenProps = {
        handleClick: jest.fn(),
        handleTempInput: jest.fn()
    }
    const wrapper = shallow(<CaptureTemp {...screenProps} />)
    it('It should get the temperature value', () => {
        const {handleClick,handleTempInput} = wrapper.props()
        expect(handleClick).toBeUndefined()
        expect(handleTempInput).toBeUndefined()
        

    })
});

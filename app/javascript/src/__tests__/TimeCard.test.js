import React from 'react'
import { mount } from 'enzyme' 
import Home from '../containers/Home'
import {Link} from 'react-router-dom'

describe('Has card mounted', () => {

    it('should display card', () => {
        const wrapper = mount( <Home />)
        expect(wrapper.find('time_card')).toHaveLength(1)
        expect(wrapper.find(Link).props().to).toBe('/time_card')
    });
    
});

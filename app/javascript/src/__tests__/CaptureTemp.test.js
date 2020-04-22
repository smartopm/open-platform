import React from 'react'
import { shallow } from 'enzyme'
import CaptureTemp from '../components/CaptureTemp'
import { MockedProvider } from '@apollo/react-testing'
import { TemperateRecord } from '../graphql/mutations'
import wait from 'waait'

describe('temperature component', () => {

    const mock= [{

    }]
    const screenProps = {
        refId: 1,
        refName: 'Test name'
    }
    it('component is mounted', () => {
        const wrapper = shallow(
            <MockedProvider mock={[]}>
                <CaptureTemp {...screenProps} />
            </MockedProvider>
        )
        expect(wrapper.find('.button'))
    })
    const wrapper = shallow(
        <MockedProvider mock={[]}>
            <CaptureTemp {...screenProps} />
        </MockedProvider>)
    it('It should get the temperature value', () => {
        const { refId, refName } = wrapper.props()
        expect(refId).toBe(refId)
        expect(refName).toBe(refName)

    })
});

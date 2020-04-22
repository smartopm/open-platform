import React from 'react'
import { shallow, mount } from 'enzyme'
import CaptureTemp from '../components/CaptureTemp'
import { MockedProvider } from '@apollo/react-testing'
import { TemperateRecord } from '../graphql/mutations'
import wait from 'waait'

describe('temperature component', () => {

    const sentence = {data: {
        "temperatureUpdate": {
          "eventLog": {
            "sentence": "Temperature for Dennis was recorded by Dennis Mubamba"
          }
        }
      }}
    const mock= [{
        request: {
            query: TemperateRecord, 
            variable: {refId: "1", temp: "36.5", refName: "Tet Name"},
            
        }, 
        result: {data: {sentence}}

    }]
    const screenProps = {
        refId: "1",
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
        <MockedProvider mock={mock} addTypename={false}>
            <CaptureTemp {...screenProps} />
        </MockedProvider>)
    it('It should get the temperature value', () => {
        const { refId, refName } = wrapper.props()
        expect(refId).toBe(refId)
        expect(refName).toBe(refName)

    })
    it('it should run mutation', async () => {
        const wrapper = mount(
            <MockedProvider mock={mock} addTypename={false}>
                <CaptureTemp {...screenProps} />
            </MockedProvider>)
        const callMut = false
        wrapper.find('button').simulate('click')
        await wait(0)

        expect(callMut).toBe(true)
        const tree = wrapper.toJSON()
        expect(tree.children).toContain('Temperature')
    });
    
});

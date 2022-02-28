/* eslint-disable */
import React from 'react';
import { shallow, mount } from 'enzyme';
import CaptureTemp from '../components/CaptureTemp';
import { MockedProvider } from '@apollo/react-testing';
import { TemperateRecord } from '../graphql/mutations';

describe('temperature component', () => {
  const screenProps = {
    refId: '1',
    refType: 'Logs::Temperature',
    refName: 'Test name'
  };
  const mock = [
    {
      request: {
        query: TemperateRecord,
        variable: { refId: 1, temp: '36.5', refName: 'Test Name', refType: 'Users::User' }
      },
      result: {
        data: {
          temperatureUpdate: {
            eventLog: {
              sentence: 'Temperature for Dennis was recorded by Dennis Mubamba'
            }
          }
        }
      }
    }
  ];

  it('component is mounted', () => {
    const wrapper = shallow(
      <MockedProvider mock={[]}>
        <CaptureTemp {...screenProps} />
      </MockedProvider>
    );
    expect(wrapper.find('.button'));
  });
  const wrapper = shallow(
    <MockedProvider mock={[]} addTypename={false}>
      <CaptureTemp {...screenProps} />
    </MockedProvider>
  );
  it('It should get the temperature value', () => {
    const { refId, refName } = wrapper.props();
    expect(refId).toBe(refId);
    expect(refName).toBe(refName);
  });
  it('it should run mutation', async () => {
    const wrapper = mount(
      <MockedProvider mock={mock} addTypename={false}>
        <CaptureTemp {...screenProps} />
      </MockedProvider>
    );
    await wrapper.find('button').simulate('click');
    expect(wrapper.find('tempvalue')).toMatchObject({});
    wrapper.update();
  });
});

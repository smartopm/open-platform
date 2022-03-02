import React from 'react';
import { shallow, mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import CaptureTemp from '../components/CaptureTemp';
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
    expect(wrapper.find('.button')).toBeTruthy();
  });
  const wrapper = shallow(
    <MockedProvider mock={[]} addTypename={false}>
      <CaptureTemp {...screenProps} />
    </MockedProvider>
  );
  it('should get the temperature value', () => {
    const { refId, refName } = wrapper.props();
    expect(refId).toBe(refId);
    expect(refName).toBe(refName);
  });
  it('should run mutation', async () => {
    const componentWrapper = mount(
      <MockedProvider mock={mock} addTypename={false}>
        <CaptureTemp {...screenProps} />
      </MockedProvider>
    );
    await componentWrapper.find('button').simulate('click');
    expect(componentWrapper.find('tempvalue')).toMatchObject({});
    componentWrapper.update();
  });
});

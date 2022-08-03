import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import CaptureTemp from '../components/CaptureTemp';
import { TemperateRecord } from '../graphql/mutations';

describe('temperature component', () => {
  const screenProps = {
    refId: '123456asdfgh',
    refType: 'Users::User',
    refName: 'Test Name'
  };
  const mock = [
    {
      request: {
        query: TemperateRecord,
        variable: {
          refId: '123456asdfgh',
          temp: '36',
          refName: 'Test Name',
          refType: 'Users::User'
        }
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
    const wrapper = render(
      <MockedProvider mock={[]}>
        <CaptureTemp {...screenProps} />
      </MockedProvider>
    );
    expect(wrapper.queryByTestId('log-btn')).toBeInTheDocument();
  });

  it('runs mutation', async () => {
    const componentWrapper = render(
      <MockedProvider mock={mock}>
        <CaptureTemp {...screenProps} />
      </MockedProvider>
    );

    fireEvent.click(componentWrapper.queryByTestId('log-btn'));

    await waitFor(() => {
      expect(componentWrapper.queryByText('common:errors.empty_input')).toBeInTheDocument();
    }, 10);
  });
});

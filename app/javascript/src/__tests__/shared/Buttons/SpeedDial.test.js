import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import CustomSpeedDial from '../../../shared/buttons/SpeedDial';
import '@testing-library/jest-dom/extend-expect';

describe('Speed dial component', () => {
  it('should render the speed dial button when no actions provided', () => {
    const mock = jest.fn();
    const btn = render(<CustomSpeedDial actions={[]} handleAction={mock} />);
    expect(btn.queryByTestId('add_icon')).toBeInTheDocument();

    fireEvent.click(btn.queryByTestId('speed_dial_btn'));
    expect(mock).toBeCalled();
  });

  it('should render the speed dial button when it has actions', () => {
    const mock = jest.fn();
    const actions = [
      {
        icon: <h4>A</h4>,
        name: 'First Icon'
      }
    ];
    const btn = render(<CustomSpeedDial actions={actions} handleAction={mock} />);
    expect(btn.queryByTestId('add_icon')).not.toBeInTheDocument();
    expect(btn.queryAllByTestId('speed_dial_action')[0]).toBeInTheDocument();
    expect(btn.queryByTestId('close_icon')).toBeInTheDocument();
    expect(btn.queryByTestId('speed_dial_icon')).toBeInTheDocument();
  });
});

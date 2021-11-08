import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import { render } from '@testing-library/react';
import SpeedDial from '../../shared/buttons/SpeedDial';

describe('Speed Dial', () => {
  it('should render the Speed Dial component', () => {
    const actions = [
      {
        icon: <SpeedDialIcon />,
        name: 'sample-icon1',
        handleClick: jest.fn()
      },
      {
        icon: <SpeedDialIcon />,
        name: 'sample-icon2',
        handleClick: jest.fn()
      }
    ];
    const card = render(
      <SpeedDial 
        open
        handleClose={jest.fn()}
        handleOpen={jest.fn()}
        direction='down'
        actions={actions}
      />);
    expect(card.queryByTestId('speed-dial')).toBeInTheDocument();
  });
});
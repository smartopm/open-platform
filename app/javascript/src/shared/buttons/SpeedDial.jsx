import React from 'react';
import PropTypes from 'prop-types';
import SpeedDial from '@mui/material/SpeedDial';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

export default function SpeedDialButton({
  open,
  handleClose,
  handleOpen,
  direction,
  actions,
  handleAction
}) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');

  return (
    <div className={classes.wrapper} data-testid="speed-dial">
      <SpeedDial
        ariaLabel="SpeedDial"
        className={classes.speedDial}
        data-testid="speed_dial_btn"
        icon={
          actions.length ? (
            <SpeedDialIcon
              data-testid="speed_dial_icon"
              openIcon={<CloseIcon data-testid="close_icon" />}
            />
          ) : (
            <AddIcon data-testid="add_icon" />
          )
        }
        onClose={handleClose}
        onOpen={handleOpen}
        onClick={actions.length === 0 ? handleAction : null}
        open={matches || open}
        direction={direction}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.handleClick}
            data-testid="speed_dial_action"
          />
        ))}
      </SpeedDial>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'fixed',
    transform: 'translateZ(0px)'
  },
  speedDial: {
    position: 'absolute',
    zIndex: '1000',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2)
    }
  }
}));

SpeedDialButton.defaultProps = {
  actions: [],
  direction: 'down',
  handleAction: () => {},
  open: false,
  handleClose: () => {},
  handleOpen: () => {},
};

SpeedDialButton.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ),
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleOpen: PropTypes.func,
  direction: PropTypes.string,
  handleAction: PropTypes.func
};

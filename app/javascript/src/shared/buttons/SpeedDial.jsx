import React from 'react';
import PropTypes from 'prop-types';
import SpeedDial from '@mui/material/SpeedDial';
import makeStyles from '@mui/styles/makeStyles';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';

export default function SpeedDialButton({
  open,
  actions,
  direction,
  handleAction,
  handleSpeedDial,
  tooltipOpen
}) {
  const classes = useStyles();

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
        onClick={actions.length === 0 ? handleAction : null}
        direction={direction}
        onClose={handleSpeedDial}
        onOpen={handleSpeedDial}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={tooltipOpen ? <Typography variant='caption'>{action.name}</Typography> : action.name}
            onClick={action.handleClick}
            tooltipOpen={tooltipOpen}
            data-testid="speed_dial_action"
            style={{marginBottom: '10px'}}
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
  open: false,
  handleAction: () => {},
  handleSpeedDial: () => {},
  tooltipOpen: false
};

SpeedDialButton.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ),
  direction: PropTypes.string,
  open: PropTypes.bool,
  handleAction: PropTypes.func,
  handleSpeedDial: PropTypes.func,
  tooltipOpen: PropTypes.bool
};

import React from 'react';
import PropTypes from 'prop-types';
import SpeedDial from '@material-ui/lab/SpeedDial';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

export default function SpeedDialButton({
  open,
  handleClose,
  handleOpen,
  direction,
  actions,
  handleAction
}) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper} style={actions.length > 0 ? {height: 200} : {}} data-testid="speed-dial">
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
        open={open}
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
  direction: '',
  handleAction: () => {}
};

SpeedDialButton.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  direction: PropTypes.string,
  handleAction: PropTypes.func
};

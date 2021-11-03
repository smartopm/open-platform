import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    position: 'fixed',
    top: 60,
    right: 11,
    color: '#FFFFFF'
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

export default function CustomSpeedDial({ actions, handleAction }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  function handleOpenClose() {
    setOpen(!open);
  }

  return (
    <SpeedDial
      ariaLabel="Custom SpeedDial"
      className={classes.root}
    //   if there are no actions show an non-animated icon
      icon={actions.length ? <SpeedDialIcon data-testid="speed_dial_icon" openIcon={<CloseIcon data-testid="close_icon"  />} /> : <AddIcon data-testid="add_icon" />}
      onClose={handleOpenClose}
      onOpen={handleOpenClose}
      open={open}
      onClick={handleAction}
      data-testid="speed_dial_btn"
    >
      {actions.map(action => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
          data-testid="speed_dial_action"
        />
      ))}
    </SpeedDial>
  );
}

CustomSpeedDial.defaultProps = {
  actions: [],
  handleAction: () => {}
};
CustomSpeedDial.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      name: PropTypes.string,
      onclick: PropTypes.func
    })
  ),
  handleAction: PropTypes.func
};

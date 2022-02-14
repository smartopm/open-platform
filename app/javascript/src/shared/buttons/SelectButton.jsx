import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

export default function SelectButton({
  buttonText,
  open,
  anchorEl,
  anchorRef,
  handleClose,
  options,
  selectedKey,
  handleMenuItemClick,
  handleClick
}) {
  return (
    <>
      <ButtonGroup color="primary" ref={anchorRef} aria-label="outlined select button" data-testid='button'>
        <Button>{buttonText}</Button>
        <Button onClick={handleClick}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorEl} transition style={{zIndex: 2000}} data-testid='list'>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" data-testid="select_option">
                  {Object.entries(options).map(([key, val]) => (
                    <MenuItem
                      key={key}
                      selected={key === selectedKey}
                      onClick={() => handleMenuItemClick(key)}
                      value={key}
                    >
                      {val}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

SelectButton.defaultProps = {
  selectedKey: ''
}

SelectButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.string.isRequired,
  anchorRef: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object.isRequired,
  selectedKey: PropTypes.string,
  handleMenuItemClick: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

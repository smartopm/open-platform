import React from 'react';
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
      <ButtonGroup color="primary" ref={anchorRef} aria-label="outlined select button">
        <Button>{buttonText}</Button>
        <Button onClick={handleClick}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorEl} transition>
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

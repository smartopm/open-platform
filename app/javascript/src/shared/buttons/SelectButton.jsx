/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
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
import ListItemText from '@material-ui/core/ListItemText';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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
  const [openSubMenu, setOpenSubMenu] = useState(false);
  function handleSubMenuClick(opt) {
    opt.handleMenuItemClick(opt.key, opt.value);
    setOpenSubMenu(!openSubMenu);
  }
  return (
    <>
      <ButtonGroup
        color="primary"
        ref={anchorRef}
        aria-label="outlined select button"
        data-testid="button"
      >
        <Button>{buttonText}</Button>
        <Button onClick={handleClick}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorEl}
        transition
        style={{ zIndex: 2000 }}
        data-testid="list"
      >
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
                  {options.map(opt => (
                    <>
                      <MenuItem
                        key={opt.key}
                        selected={opt.key === selectedKey}
                        onClick={
                          opt.subMenu
                            ? () => handleSubMenuClick(opt)
                            : () => opt.handleMenuItemClick(opt.key, opt.value)
                        }
                        value={opt.key}
                      >
                        <ListItemText primary={opt.value} />
                        {opt.subMenu && (openSubMenu ? <ExpandMore /> : <ExpandLess />)}
                      </MenuItem>
                      {selectedKey === opt.key &&
                        openSubMenu &&
                        opt.subMenu &&
                        opt.subMenu.map(submenu => (
                          <MenuItem
                            style={{ paddingLeft: '30px' }}
                            key={submenu.key}
                            selected={submenu.key === selectedKey}
                            onClick={() => submenu.handleMenuItemClick(submenu.key, submenu.value)}
                            value={opt.key}
                          >
                            {submenu.value}
                          </MenuItem>
                        ))}
                    </>
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
  selectedKey: '',
  anchorEl: {},
  anchorRef: {}
};

SelectButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  anchorRef: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  selectedKey: PropTypes.string,
  handleMenuItemClick: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
};

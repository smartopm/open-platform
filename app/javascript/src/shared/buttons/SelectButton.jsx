/* eslint-disable no-nested-ternary */
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
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { splitCamelCase } from '../../utils/helpers';

export default function SelectButton({
  buttonText,
  open,
  anchorEl,
  anchorRef,
  handleClose,
  options,
  selectedKey,
  handleClick
}) {
  const [openSubMenu, setOpenSubMenu] = useState({ isOpen: false, name: '' });
  function handleSubMenuClick(opt) {
    opt.handleMenuItemClick(opt.key, opt.value);
    if (openSubMenu.name !== opt.key && openSubMenu.name !== '' && openSubMenu.isOpen === true) {
      return setOpenSubMenu({ ...openSubMenu, name: opt.key });
    }
    return setOpenSubMenu({ isOpen: !openSubMenu.isOpen, name: opt.key });
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
        <Button onClick={handleClick} data-testid="arrow-icon">
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
                  {options
                    .filter(opt => opt.show)
                    .map(opt => (
                      <div key={opt.key}>
                        <MenuItem
                          selected={opt.key === selectedKey}
                          onClick={
                            opt.subMenu
                              ? () => handleSubMenuClick(opt)
                              : () => opt.handleMenuItemClick(opt.key, opt.value)
                          }
                          value={opt.key}
                        >
                          <ListItemText primary={splitCamelCase(opt.value)} />
                          {opt.subMenu &&
                            (openSubMenu.isOpen && openSubMenu.name === opt.key ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            ))}
                        </MenuItem>
                        {openSubMenu.name === opt.key &&
                          openSubMenu.isOpen &&
                          opt.subMenu &&
                          opt.subMenu
                            .filter(submenu => submenu.show)
                            .map(submenu => (
                              <MenuItem
                                style={{ paddingLeft: '30px' }}
                                key={submenu.key}
                                selected={submenu.key === selectedKey}
                                onClick={() =>
                                  submenu.handleMenuItemClick(submenu.key, submenu.value)
                                }
                                value={opt.key}
                              >
                                {submenu.value}
                              </MenuItem>
                            ))}
                      </div>
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
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      handleMenuItemClick: PropTypes.func,
      show: PropTypes.bool,
      subMenu: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          value: PropTypes.string,
          handleMenuItemClick: PropTypes.func,
          show: PropTypes.bool
        })
      )
    })
  ).isRequired,
  selectedKey: PropTypes.string,
  handleClick: PropTypes.func.isRequired
};

/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';

export default function SelectButton({
  defaultButtonText,
  open,
  anchorEl,
  handleClose,
  options,
  selectedKey,
  handleClick,
  style,
  mobileIcon,
  testId
}) {
  const [openSubMenu, setOpenSubMenu] = useState({ isOpen: false, name: '' });
  const [buttonText, setButtonText] = useState(null);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:900px)');

  function handleOpenSubMenuClick(opt) {
    setOpenSubMenu({ isOpen: !openSubMenu.isOpen, name: opt.key });
    setButtonText(opt.name);
  }

  function handleMenuClick(opt) {
    setOpenSubMenu({ ...openSubMenu, name: opt.key });
    setButtonText(opt.name);
  }

  function handleMenuItemClick(opt) {
    opt.handleMenuItemClick(opt.key, opt.value);
    setButtonText(opt.name);
  }

  function handleSubMenuClick(opt) {
    opt.handleMenuItemClick(opt.key, opt.value);
    if (openSubMenu.name !== opt.key && openSubMenu.name !== '' && openSubMenu.isOpen === true) {
      return handleMenuClick(opt);
    }
    return handleOpenSubMenuClick(opt);
  }

  return (
    <>
      {(mobileIcon && matches) ? (
        <IconButton onClick={e => handleClick(e)} color="primary">
          {mobileIcon}
        </IconButton>
      ) : (
        <ButtonGroup color="primary" aria-label="outlined select button" data-testid="button">
          <Button>{buttonText || defaultButtonText}</Button>
          <Button
            onClick={e => handleClick(e)}
            data-testid={`${testId || 'arrow-icon'}`}
            className="option_menu_toggler"
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
      )}
      <Popper
        open={open}
        anchorEl={anchorEl}
        transition
        style={style}
        className={classes.poper}
        data-testid="list"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [-40, 0]
            }
          }
        ]}
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
                              : () => handleMenuItemClick(opt)
                          }
                          value={opt.key}
                          id={opt.key}
                        >
                          <ListItemText primary={opt.name} />
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
                                id={opt.key}
                              >
                                {submenu.name}
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

const useStyles = makeStyles(() => ({
  poper: {
    zIndex: 2000
  }
}));

SelectButton.defaultProps = {
  selectedKey: '',
  anchorEl: {},
  anchorRef: {},
  style: {},
  mobileIcon: undefined,
  options: [],
  testId: null
};

SelectButton.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  anchorRef: PropTypes.object,
  defaultButtonText: PropTypes.string.isRequired,
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
  ),
  selectedKey: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  mobileIcon: PropTypes.node,
  testId: PropTypes.string
};

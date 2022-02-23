import React, { useState, useRef } from 'react'
import {
  ButtonGroup,
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import { objectAccessor } from '../../utils/helpers';

export default function ButtonGroupSelect({
  options,
  selectedOption,
  setSelectedOption ,
  handleSelectOption
}){
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { t } = useTranslation('task')
  const matches = useMediaQuery('(max-width:800px)');

  function handleMenuItemClick(_event, key) {
    setSelectedOption(key);
    setOpen(false);
    handleSelectOption(key)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup color="primary" ref={anchorRef} aria-label="outlined primary button group split button">
        <Button style={matches ? {fontSize: '9px'} : { width: '159px'}}>
          {selectedOption ? objectAccessor(options, selectedOption) : t('misc.select')}
        </Button>
        <Button
          color="primary"
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open anchorEl={anchorRef.current} transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {Object.entries(options).map(([key, val]) => (
                    <MenuItem
                      key={key}
                      selected={key === selectedOption}
                      onClick={(event) => handleMenuItemClick(event, key)}
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
  )
}

ButtonGroupSelect.propTypes = {
  options: PropTypes.shape.isRequired,
  selectedOption: PropTypes.string.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  handleSelectOption: PropTypes.func.isRequired
}

import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import HelpCenterRoundedIcon from '@mui/icons-material/HelpCenterRounded';
import { styled } from '@mui/material/styles';

/**
 *
 * @param {String} name name to be used for capturing the state
 * @param {String} label label  used to identify the field name
 * @param {String} value current state of the switch
 * @param {Function} handleChange this helps control the current state of the switch
 * @param {String} toolTip if present, renders tooltip with switch
 * @description basic switch component
 * @returns {Node}
 */
export default function SwitchInput({
  name,
  label,
  value,
  required,
  handleChange,
  labelPlacement,
  className,
  toolTip
}) {
  return (
    <>
      <FormControlLabel
        labelPlacement={labelPlacement}
        control={(
          <Switch
            checked={value}
            onChange={handleChange}
            name={name}
            color="primary"
            required={required}
            className={className}
            size="small"
          />
        )}
        label={label}
      />
      {toolTip && toolTip.length > 0 && (
        <CustomWidthTooltip title={toolTip}>
          <HelpCenterRoundedIcon />
        </CustomWidthTooltip>
      )}
    </>
  );
}

SwitchInput.defaultProps = {
  labelPlacement: 'start',
  required: false,
  className: '',
  toolTip: null
};

SwitchInput.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  name: PropTypes.string.isRequired,
  labelPlacement: PropTypes.string,
  value: PropTypes.bool.isRequired,
  required: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  toolTip: PropTypes.string
};

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    placement="right"
    sx={{ display: 'inline-block', ml: '15px', pt: '5px' }}
  />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 200
  }
});

import React from 'react'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PropTypes from 'prop-types'
import { titleize } from '../../../utils/helpers';

// TODO: Improve on how this toggler works or deprecate it in favor of line 27
export default function Toggler({ type, handleType, data }) {
  return (
    <ToggleButtonGroup
      value={type}
      exclusive
      onChange={handleType}
      aria-label="toggle different modes"
      style={{ marginBottom: '10px' }}
    >
      <ToggleButton value={data.type} aria-label={data.type}>
        {titleize(data.type)}
      </ToggleButton>
      <ToggleButton value={data.antiType} aria-label={data.antiType}>
        {titleize(data.antiType)}
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export function MultipleToggler({ type, handleType, options}) {
  return (
    <ToggleButtonGroup
      value={type}
      exclusive
      onChange={handleType}
      aria-label="toggle different modes"
      style={{ marginBottom: '10px' }}
    >
      {Array.isArray(options) && options.length > 0 && options.map(option => (
        <ToggleButton key={option} value={option} aria-label={option}>
          {titleize(option)}
        </ToggleButton>
    ))}
    </ToggleButtonGroup>
  )
}

Toggler.propTypes = {
  /**
   * This is managed by the state of the parent component that tells toggler the current view
   */
  type: PropTypes.string.isRequired,
  /**
   * Function that switches between the toggler(it switches between the type and anti-type)
   */
  handleType: PropTypes.func.isRequired,
  /**
   * Static data that needed in case a component uses different wording
   */
  data: PropTypes.shape({
    type: PropTypes.string.isRequired,
    antiType: PropTypes.string.isRequired
  }).isRequired
}


MultipleToggler.propTypes = {
  /**
   * This is managed by the state of the parent component that tells toggler the current view
   */
  type: PropTypes.string.isRequired,
  /**
   * Function that switches between the toggler(it switches between the type and anti-type)
   */
  handleType: PropTypes.func.isRequired,
  /**
   * Static data that needed in case a component uses different wording
   */
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
}


import React from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import PropTypes from 'prop-types'
import { titleize } from '../../utils/helpers';

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


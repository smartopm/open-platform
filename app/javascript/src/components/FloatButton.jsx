import React from 'react'
import PropTypes from 'prop-types'
import { Fab } from '@material-ui/core'
import { css, StyleSheet } from 'aphrodite'

export default function FloatButton({ title, handleClick, extraStyles, otherClassNames }) {
  return (
    <Fab
      variant="extended"
      onClick={handleClick}
      color="primary"
      style={extraStyles}
      // eslint-disable-next-line no-use-before-define
      className={`${css(styles.formButton)} ${otherClassNames}`}
    >
      {title}
    </Fab>
  )
}

FloatButton.defaultProps = {
  extraStyles: {},
  otherClassNames: ''
}
FloatButton.propTypes = {
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  extraStyles: PropTypes.object,
  otherClassNames: PropTypes.string,
}

const styles = StyleSheet.create({
  formButton: {
    height: 51,
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%',
    color: '#FFFFFF'
  }
})

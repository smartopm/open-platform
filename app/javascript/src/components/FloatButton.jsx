import React from 'react'
import PropTypes from 'prop-types'
import { Fab } from '@material-ui/core'
import { css, StyleSheet } from 'aphrodite'

export default function FloatButton({ title, handleClick }) {
  return (
    <Fab
      variant="extended"
      onClick={handleClick}
      color="primary"
      // eslint-disable-next-line no-use-before-define
      className={`btn ${css(styles.formButton)} `}
    >
      {title}
    </Fab>
  )
}
FloatButton.propTypes = {
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
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
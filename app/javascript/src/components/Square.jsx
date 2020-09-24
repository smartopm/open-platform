/* eslint-disable no-use-before-define */
import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'

export default function Square({ title, subtitle, squareStyle }) {
  const { backgroundColor, textColor, borderColor } = squareStyle

  return (
    <div
      className={`${css(styles.root)} card text-center`}
      style={{
        backgroundColor,
        color: textColor,
        border: `1px solid ${borderColor}`
      }}
    >
      <div className="card-body">
        <span className={css(styles.squareTitle)}>
          {title}
        </span>
        <p className={css(styles.subtitleText)}>{subtitle}</p>
      </div>
    </div>
  )
}

Square.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  squareStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    borderColor: PropTypes.string
  }).isRequired
}

const styles = StyleSheet.create({
  subtitleText: {
    fontSize: 10,
    lineHeight: '10px',
    fontFamily: 'HelveticaNeue'
  },
  squareTitle: {
    fontSize: 25
  },
  root: {
    minWidth: 100,
    height: 97,
    margin: 10,
    fontWeight: 450,
    borderRadius: 4,
    boxShadow: '0 0 black',
    fontFamily: 'Helvetica'
  }
})

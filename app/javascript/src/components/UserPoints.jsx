/* eslint-disable no-use-before-define */
import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'
import Square from "./Square"
import { useWindowDimensions } from '../utils/customHooks'
import colors from '../themes/nkwashi/colors'

export default function UserPoints({ userPoints }) {
  const { width } = useWindowDimensions()
  const { primary, lightGreen, textColor } = colors

  const squareSubtitles = {
    total: 'Total number of points',
    articles: 'Points for articles read',
    comments: 'Points for comments made',
    logins: 'Points for logging in',
    referrals: 'Points for referrals',
  }

  return (
    <div className={css(styles(width).root)}>
      {
        Object.keys(userPoints).map((subject, index) => (
          <Square
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            title={userPoints[subject]}
            subtitle={squareSubtitles[subject]}
            squareStyle={{
              backgroundColor: subject === 'total' ? primary : lightGreen,
              textColor: subject === 'total' ? textColor : primary,
              borderColor: primary
            }}
          />
        ))
      }
    </div>
  )
}

UserPoints.propTypes = {
  userPoints: PropTypes.shape({
    total: PropTypes.string.isRequired,
    articles: PropTypes.string.isRequired,
    comments: PropTypes.string.isRequired,
    logins: PropTypes.string.isRequired,
    referrals: PropTypes.string.isRequired
  }).isRequired
}

const styles = (screenWidth) => StyleSheet.create({
  root: {
    display: 'flex',
    width: 550,
    margin: '0 auto',
    flexWrap: 'nowrap',
    '@media (max-width: 600px)': {
      width: screenWidth,
      overflowX: "auto",
      overflowY: 'hidden',
      '::-webkit-scrollbar': {
        display: 'none'
      }
    }
  }
})

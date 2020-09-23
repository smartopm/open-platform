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
    article: 'Points for articles read',
    comment: 'Points for comments made',
    login: 'Points for logging in',
    referral: 'Points for referrals',
  }
  const subjects = Object.keys(userPoints).filter(subject => subject !== "__typename")

  return (
    <div className={css(styles(width).root)}>
      {
        subjects.map((subject, index) => (
          <Square
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            title={userPoints[subject].toString()}
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
    total: PropTypes.number.isRequired,
    article: PropTypes.number.isRequired,
    comment: PropTypes.number.isRequired,
    login: PropTypes.number.isRequired,
    referral: PropTypes.number.isRequired
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

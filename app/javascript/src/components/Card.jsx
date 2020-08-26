/* eslint-disable */
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'
import { Context as ThemeContext } from '../../Themes/Nkwashi/ThemeProvider'

export default function Card({
  title,
  path,
  icon,
  from,
  clientName,
  clientNumber,
  children,
  handleClick,
  id,
  menu,
  access,
  authState
}) {
  const theme = useContext(ThemeContext)
  if (!access.includes(authState.user.userType.toLowerCase())) {
    return null
  }

  return (
    <div
      className={`${css(styles.cardSize)} card align-self-center text-center`}
      onClick={handleClick}
    >
      <span>{children}</span>
      <Link
        to={{
          pathname: path,
          state: {
            clientName: clientName,
            clientNumber: clientNumber,
            from: from
          }
        }}

        id={id}
        className={`card-link`}
      >
        {menu}

        <div className="card-body">
          <h5 className="card-title">
            <span style={{ color: theme.primaryColor }} >
              {icon}
            </span>
          </h5>
          <p className={css(styles.CardtextIcon)}>{title}</p>

        </div>
      </Link>


    </div>
  )
}

export function SVGIcon({ image, alt }) {
  return <img src={image} alt={alt} />
}

Card.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node,
  title: PropTypes.string,
  path: PropTypes.string,
  from: PropTypes.string,
  handleClick: PropTypes.func,
  clientName: PropTypes.string,
  clientNumber: PropTypes.string,
  id: PropTypes.string
}

const styles = StyleSheet.create({
  CardtextIcon: {
    marginTop: '15.5%'
  },
  CardtextImg: {
    marginTop: '21%'
  },
  cardSize: {
    width: 200,
    height: 154
  }
})

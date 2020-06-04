import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'
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
  titleStyle,
  access,
  authState
}) {
  if (!access.includes(authState.user.userType.toLowerCase())) {
    return null
  }
  return (
    <Fragment>
      <div
        className={`${css(styles.cardSize)} card align-self-center text-center`}
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
          onClick={handleClick}
          id={id}
          className={`card-link`}
        >
          <div className="card-body">
            <h5 className="card-title">
              <span>{icon}</span>
            </h5>
            <p className={titleStyle}>{title}</p>
          </div>
        </Link>
      </div>
    </Fragment>
  )
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
  cardSize: {
    width: 200,
    height: 154
  }
})

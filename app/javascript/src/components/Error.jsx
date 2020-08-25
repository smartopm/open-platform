eslint-disable
import React from 'react'
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'

export default function ErrorPage({ title }) {
  return (
    <div className={` ${css(styles.errorPage)}`}>
      <div className="container ">
        <div className="row d-flex justify-content-center">
          <h4 className={`text-center align-items-center ${css(styles.title)}`}>
            {title}
          </h4>
        </div>
        <br />
        <div className="row d-flex justify-content-center">
          <Link
            to="/"
            className={`btn btn-lg btn-block error-link ${css(
              styles.callButton
            )}`}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  errorPage: {
    backgroundColor: 'rgb(229, 63, 69)',
    height: '100vh'
  },
  callButton: {
    backgroundColor: 'rgb(233, 147, 83, 0)',
    textTransform: 'unset',
    color: '#FFFFFF',
    border: '2px solid black',
    borderColor: '#FFFFFF',
    marginTop: 250,
    width: '35%'
  },
  title: {
    color: '#FFFFFF',
    marginTop: 120
  }
})

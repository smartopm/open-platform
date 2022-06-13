import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles'

export default function Tag({ tag, handleTagOpen }){
    const classes = useStyles()
    return (
      <Button
        className={classes.tagButton}
        onClick={() => handleTagOpen(tag)}
      >
        {tag}
      </Button>
    )
  }
  Tag.defaultProps = {
    handleTagOpen: () => false
  }

  Tag.propTypes = {
    tag:  PropTypes.string.isRequired,
    handleTagOpen: PropTypes.func,
  }

const useStyles = makeStyles({
    tagButton: {
      color: '#66a69b',
      backgroundColor: '#eefefc',
      marginLeft: '10px'
    }
  })

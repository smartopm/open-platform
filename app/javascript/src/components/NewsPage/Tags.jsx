/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TagPosts from './TagPosts'

export default function TagsComponent({ tags }) {
  const [open, setOpen] = useState(false)
  const [tagName, setTagName] = useState(null)
  const classes = useStyles();

  function handleTagOpen(tag) {
    setOpen(true)
    setTagName(tag)
  }

  function handleTagClose(){
    setOpen(false)
    setTagName(null)
  }
  
  return (
    <>
      <div className={classes.tagList}>
        {tags !== undefined && Object.keys(tags).map((tag, i) => 
          (
            // eslint-disable-next-line react/no-array-index-key
            <Button key={i} className={classes.tagButton} onClick={() => handleTagOpen(tag)}>{tag}</Button>
            )
    )}
      </div>
      <TagPosts open={open} handleClose={() => handleTagClose()} tagName={tagName} />
    </>
  )
}

const useStyles = makeStyles({
  tagList: {
    display: 'table',
    margin: '40px auto'
  },
  tagButton: {
    color: '#66a69b',
    backgroundColor: '#eefefc',
    marginLeft: '10px'
  }
});

TagsComponent.defaultProps = {
  tags: {}
 }
 TagsComponent.propTypes = {
   // eslint-disable-next-line react/forbid-prop-types
   tags: PropTypes.object
 }
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles';
import TagPosts from './TagPosts'
import Tag from './Tag'

export default function TagsComponent({ tags, wordpressEndpoint }) {
  const [open, setOpen] = useState(false)
  const [tagName, setTagName] = useState(null)
  const classes = useStyles()

  function handleTagOpen(tag) {
    setOpen(true)
    setTagName(tag)
  }

  function handleTagClose() {
    setOpen(false)
    setTagName(null)
  }

  return (
    <>
      <div className={classes.tagList}>
        {tags !== undefined &&
          Object.keys(tags).map((tag, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Tag tag={tag} key={i} handleTagOpen={handleTagOpen} /> 
          ))}
      </div>
      <TagPosts
        open={open}
        handleClose={() => handleTagClose()}
        tagName={tagName}
        wordpressEndpoint={wordpressEndpoint}
      />
    </>
  )
}

const useStyles = makeStyles({
  tagList: {
    display: 'table',
    margin: '40px auto'
  }
})

TagsComponent.defaultProps = {
  tags: {}
}
TagsComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  tags: PropTypes.object,
  wordpressEndpoint: PropTypes.string.isRequired
}

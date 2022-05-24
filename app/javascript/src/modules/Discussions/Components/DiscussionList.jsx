/* eslint-disable no-use-before-define */
import React, { Fragment, useState } from 'react'
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  Typography,
  ListItemAvatar,
  IconButton
} from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@mui/icons-material/Delete'
import { css, StyleSheet } from 'aphrodite'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'
import { truncateString } from '../../../utils/helpers'
import Avatar from '../../../components/Avatar'
import { DiscussionUpdateMutation } from '../../../graphql/mutations'
import DeleteDialogueBox from '../../../shared/dialogs/DeleteDialogue'
import CenteredContent from '../../../components/CenteredContent'

export default function DiscussionList({ data, refetch, isAdmin }) {
  const [updateDiscussion] = useMutation(DiscussionUpdateMutation)
  const [discussionId, setDiscussionId] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const history = useHistory()
const { t } = useTranslation('discussion')
  function handleDeleteClick(event, id = discussionId) {
    event.stopPropagation()
    event.preventDefault()
    setOpenModal(!openModal)
    setDiscussionId(id)
  }

  function deleteDiscussion() {
    updateDiscussion({ variables: { discussionId, status: 'deleted' } })
      .then(() => {
        refetch()
        setOpenModal(!openModal)
      })
      .catch(err => setError(err.message))
  }
  return (
    <div className={css(styles.discussionList)}>
      <List>
        {data.length
          ? data.map(discussion => (
            <Fragment key={discussion.id}>
              <ListItem
                alignItems="flex-start"
                onClick={() => history.push(`/discussions/${discussion.id}`)}
                className="card-link"
              >
                <ListItemAvatar style={{ marginRight: 20 }}>
                  <Avatar user={discussion.user} />
                </ListItemAvatar>
                <ListItemText
                  primary={(
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      data-testid="disc_title"
                    >
                      {discussion.title}
                    </Typography>
                    )}
                  secondary={(
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {discussion.user.name}
                      </Typography>
                      {discussion.description
                          ? ` — ${truncateString(discussion.description, 100)}`
                          : ''}
                      <span style={{ float: 'right' }}>
                        {
                           isAdmin && (
                           <IconButton
                             onClick={event => handleDeleteClick(event, discussion.id)}
                             edge="end"
                             aria-label="delete"
                             className={css(styles.deleteBtn)}
                             size="large"
                           >
                             <DeleteIcon />
                           </IconButton>
                           )
                       }
                      </span>
                    </>
                    )}
                />
              </ListItem>
              { error && <CenteredContent>{error}</CenteredContent> }
              <Divider component="li" />
            </Fragment>
            ))
          : t('headers.no_discussions')}
        <DeleteDialogueBox
          open={openModal}
          handleClose={handleDeleteClick}
          handleAction={deleteDiscussion}
          title="discussion"
        />
      </List>
    </div>
  );
}

DiscussionList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  discussionList: {
    marginLeft: '11%',
    marginRight: '12%',
    '@media (max-width: 700px)': {
      marginLeft: '2%',
      marginRight: '2%'
    }
  }
})

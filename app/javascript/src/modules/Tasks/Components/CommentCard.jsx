/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TaskDelete from './TaskDelete'
import EditField from './TaskCommentEdit'
import DateContainer from '../../../components/DateContainer'

export default function CommentCard({ data, refetch }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false) 
  const [editId, setEditId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [id, setId] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [name, setName] = useState(null)
  const [body, setBody] = useState(null)
  const { t } = useTranslation('common')

  function handleClose() {
    setEdit(false)
    setEditId(null)
  }

  function deleteClick(event) {
    setId(event.currentTarget.getAttribute('id'))
    setImageUrl(event.currentTarget.getAttribute('image'))
    setName(event.currentTarget.getAttribute('name'))
    setBody(event.currentTarget.getAttribute('body'))
    setOpen(true)
  }

  return(
    <>
      {data?.taskComments?.map((com) => (
        <Card style={{ display: 'flex' }} className={classes.root} key={com.id}>
          {!edit && editId !== com.id && <Avatar src={com.user.imageUrl} alt="avatar-image" style={{ marginTop: '7px' }} />}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {!edit && editId !== com.id && ( 
            <CardContent>
              <div style={{ display: 'flex' }}>
                <Typography className={classes.title} gutterBottom data-testid='user-name'>
                  {com.user.name}
                </Typography>
                <span 
                  data-testid="delete_icon" 
                  className={classes.itemAction}
                >
                  <DateContainer date={com.createdAt} />
                </span>
              </div>
              <Typography variant="caption" component="h2">
                {com.body}
              </Typography>
            </CardContent>
            )}
            {(!edit && editId !== com.id) && (
            <CardActions style={{ color: '#69ABA4'  }}>
              <Button
                size="small"
                color="inherit"
                onClick={() => setEditId(com.id)}
                data-testid='edit'
              >
                {t('menu.edit')}
              </Button>
              {' '}
              |
              <Button
                size="small"
                color="inherit"
                id={com.id}
                name={com.user.name}
                image={com.user.imageUrl} 
                body={com.body}
                onClick={(event) => deleteClick(event)}
                data-testid='deleteButton'
              >
                {t('menu.delete')}
              </Button>
            </CardActions>
            )}
            {editId === com.id  && <EditField handleClose={handleClose} data={com} refetch={refetch} />}
          </div>
        </Card>
      ))}
      {open && (
      <TaskDelete
        open={open}
        handleClose={() => setOpen(false)} 
        id={id}
        name={name}
        imageUrl={imageUrl} 
        refetch={refetch}
        body={body}
      />
    )}
    </>
  )
}

const useStyles = makeStyles({
  root: {
    padding: '10px 20px 10px 20px',
    borderRadius: '0 10px 10px 50px',
    backgroundColor: '#f8f8f9',
    marginBottom: '10px'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  itemAction: {
    marginLeft: 'auto',
    order: 2
  }
});

CommentCard.defaultProps = {
  data: {}
 }
 CommentCard.propTypes = {
   // eslint-disable-next-line react/forbid-prop-types
   data: PropTypes.object,
   refetch: PropTypes.func.isRequired
 }

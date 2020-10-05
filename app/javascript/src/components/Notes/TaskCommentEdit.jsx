/* eslint-disable no-use-before-define */
import React, {useState, useEffect} from 'react';
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { TaskCommentUpdate } from '../../graphql/mutations'

export default function EditField({ handleClose, data, refetch }) {
  const classes = useStyles();
  const [body, setBody] = useState('')
  const [commentUpdate] = useMutation(TaskCommentUpdate)
  function handleSubmit(event) {
    event.preventDefault();
    commentUpdate({ variables: {
      id: data.id,
      body
    }}).then(() => {
      handleClose()
      refetch()
    })
  }

  useEffect(() => {
      setBody(data.body)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return(
    <>
      <div style={{ display: 'flex' }}>
        <Avatar style={{ marginTop: '7px' }} src={data.user.imageUrl} alt="avatar-image" />
        <form className={classes.root} onSubmit={handleSubmit}>
          <Typography className={classes.title} gutterBottom>
            {data.user.name}
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', color: '#69ABA4' }}>
            <TextField
              multiline
              value={body}
              id="outlined-size-small"
              variant="outlined"
              size="small"
              onChange={e => setBody(e.target.value)}
            />
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
              <Button autoFocus variant="contained" type="submit" color="primary" style={{ marginRight: '5px' }}>
                Save changes
              </Button>
              <Button onClick={handleClose} variant="outlined" color="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    padding: 10,
    borderRadius: '0 10px 10px 50px',
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

EditField.defaultProps = {
  data: {}
 }

 EditField.propTypes = {
   // eslint-disable-next-line react/forbid-prop-types
   data: PropTypes.object,
   refetch: PropTypes.func.isRequired,
   handleClose: PropTypes.func.isRequired 
 }
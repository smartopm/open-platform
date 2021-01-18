/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useState} from 'react'
import { useLazyQuery } from 'react-apollo'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles"
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { UsersLiteQuery } from '../../graphql/queries'

export default function ParcelOwnership({ modalType }){
  const [owner, setOwner] = useState('')
  const classes = useStyles()

  const [searchUser, { data } ] = useLazyQuery(UsersLiteQuery,{
    variables: { query: owner },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  })

  function addOwnership(event){
    console.log(event)
  }
 
  function userSearch(e){
    if(e.keyCode === 13){
      searchUser()
    }
  }

  const handleChange = (event) => {
    setOwner(event.target.value);
  };

  return(
    <>
      <TextField 
        id="user-search" 
        helperText='Enter name/email/phonenumber/usertype of the user and Press enter to search'
        autoFocus
        value={owner}
        label="Owner"
        onChange={(event) => setOwner(event.target.value)}
        onKeyDown={userSearch}
      />
      <RadioGroup aria-label="user" name="user" onChange={handleChange}>
        {data?.usersLite.map((user) => (
          <FormControlLabel value={user.name} control={<Radio />} label={user.name} key={user.id} />
        ))}
      </RadioGroup>
      {modalType === 'new' && (
      <div className={classes.addIcon} role="button" onClick={addOwnership}>
        <AddCircleOutlineIcon />
        <div style={{ marginLeft: '6px', color: 'secondary' }}>
          <Typography align="center" variant="caption">
            New Owner
          </Typography>
        </div>
      </div>
      )}
    </>
  )
}

const useStyles = makeStyles(() => ({
  addIcon: {
    display: 'flex',
    marginTop: '20px',
    color: '#6CAA9F',
    cursor: 'pointer'
  },
}));
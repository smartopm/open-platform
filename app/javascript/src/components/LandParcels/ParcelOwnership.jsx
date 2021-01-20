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
  const [search, setSearch] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [ownershipFields, setOwnershipFields] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const classes = useStyles()

  const [searchUser, { data } ] = useLazyQuery(UsersLiteQuery,{
    variables: { query: ownershipFields[currentIndex]?.name },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  })

  function addOwnership(){
    setOwnershipFields([
      ...ownershipFields,
      { name: '', address: '' }
    ])
  }

  function onChangeOwnershipField(event, index) {
    updateOwnershipField(event.target.name, event.target.value, index)
  }

  function updateOwnershipField(name, value, index) {
    const fields = [...ownershipFields]
    fields[Number(index)] = { ...fields[Number(index)], [name]: value }
    setOwnershipFields(fields)
  }
 
  function userSearch(e, index){
    if(e.keyCode === 13){
      setCurrentIndex(Number(index))
      setSearch(true)
      searchUser()
    }
  }

  const handleChange = (event) => {
    setOwnershipFields([
      ...ownershipFields,
      data?.usersLite[event.target.value]
    ])
    setSearch(false);
    setShowAddress(true)
  };

  return(
    <>
      {ownershipFields.map((_field, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <TextField 
            id="user-search" 
            helperText='Enter name/email/phonenumber/usertype of the user and Press enter to search'
            autoFocus
            value={ownershipFields[Number(index)].name}
            label="Owner"
            onChange={(event) => onChangeOwnershipField(event, index)}
            onKeyDown={(e) => userSearch(e, index)}
            name="name"
            className={classes.textField}
          />
          {showAddress && (
          <TextField 
            autoFocus
            id="user-address"
            value={ownershipFields[Number(index)].address}
            label="Address"
            onChange={(event) => onChangeOwnershipField(event, index)}
            onKeyDown={userSearch}
            name="address"
            className={classes.textField}
          />
        )}
          {search && data && (
          <RadioGroup aria-label="user" name="user" onChange={handleChange}>
            {data?.usersLite.map((user, i) => (
              <FormControlLabel value={i} control={<Radio />} label={user.name} key={user.id} />
          ))}
          </RadioGroup>
      )}
        </div>
      ))}
      
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
  textField: {
    width: '450px'
  }
}));

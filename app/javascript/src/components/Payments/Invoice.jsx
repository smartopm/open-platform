import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { useQuery, useMutation } from 'react-apollo'
import CenteredContent from '../CenteredContent'
import { CustomizedDialogs } from '../Dialog'
import { UserLandParcel } from '../../graphql/queries'
import { InvoiceCreate } from '../../graphql/mutations'
import DatePickerDialog from '../DatePickerDialog'
import MessageAlert from "../MessageAlert"
import Loading from '../Loading'
import ErrorPage from '../Error'
import { formatError } from '../../utils/helpers'

export default function AddInvoices({ userId }){
  const classes = useStyles();
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState({})
  const [createInvoice] = useMutation(InvoiceCreate)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const {
    loading, error, data
  } = useQuery(UserLandParcel, {
    variables: { userId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  const handleSubmit = event => {
    event.preventDefault()
    createInvoice({
      variables: { 
        landParcelId: inputValue.parcelId,
        description: inputValue.description,
        note: inputValue.note,
        amount: inputValue.amount,
        dueDate: inputValue.selectedDate,
        status: inputValue.status
      }
    }).then(() => {
      setMessageAlert('Property added successfully')
      setIsSuccessAlert(true)
      setOpen(false)
    }).catch((err) => {
      setOpen(false);
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  if (loading) return <Loading />
  if (error) return <ErrorPage error={error.message} />

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <CenteredContent>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Create Invoice</Button>
        <CustomizedDialogs 
          open={open} 
          handleModal={() => setOpen(false)}
          dialogHeader='Add a New Invoice'
          handleBatchFilter={handleSubmit}
        >
          <div className={classes.root}>
            <div className={classes.input}>
              <Typography variant="body2" style={{marginTop: '10px'}}>
                Plot No:
              </Typography>
              <TextField
                className={classes.plotNumber}
                value={inputValue.parcelId}
                required
                onChange={(event) => setInputValue({...inputValue, parcelId: event.target.value})}
                select
              >
                {data?.userLandParcel.map(land => (
                  <MenuItem value={land.id} key={land.id}>{land.parcelNumber}</MenuItem>
                ))}
              </TextField>
            </div>
            <div className={classes.dueDate}>
              <Typography variant="body2" style={{margin: '20px 20px 0 0'}}>
                Due Date:
              </Typography>
              <DatePickerDialog 
                selectedDate={inputValue.selectedDate}
                handleDateChange={(date) => setInputValue({...inputValue, selectedDate: date})}
                width='55%'
              />
            </div>
            <div style={{display: 'flex'}}>
              <Typography variant="body2" style={{marginTop: '10px'}}>
                Amount:
              </Typography>
              <TextField
                id="standard-start-adornment"
                type='number'
                className={classes.amount}
                value={inputValue.amount}
                required
                onChange={(event) => setInputValue({...inputValue, amount: event.target.value})}
                InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              />
            </div>
            <div style={{display: 'flex', marginTop: '5px'}}>
              <Typography variant="body2" style={{marginTop: '10px'}}>
                Status:
              </Typography>
              <TextField
                className={classes.status}
                value={inputValue.status}
                required
                onChange={(event) => setInputValue({...inputValue, status: event.target.value})}
                select
              >
                <MenuItem value='in_progress'>In progress</MenuItem>
                <MenuItem value='paid'>Paid</MenuItem>
                <MenuItem value='late'>Late</MenuItem>
                <MenuItem value='cancelled'>Cancelled</MenuItem>
              </TextField>
            </div>
            <div style={{display: 'flex'}}>
              <Typography variant="body2" style={{marginTop: '10px'}}>
                Description:
              </Typography>
              <TextField
                id="description"
                className={classes.description}
                value={inputValue.description}
                multiline
                onChange={(event) => setInputValue({...inputValue, description: event.target.value})}
              />
            </div>
            <div style={{display: 'flex'}}>
              <Typography variant="body2" style={{marginTop: '10px'}}>
                Note:
              </Typography>
              <TextField
                id="note"
                className={classes.note}
                value={inputValue.note}
                multiline
                onChange={(event) => setInputValue({...inputValue, note: event.target.value})}
              />
            </div>
          </div>
        </CustomizedDialogs>
      </CenteredContent>
    </>
  )
}

const useStyles = makeStyles({
  root: {
    paddingLeft: '35px'
  },
  input: {
    display: 'flex',
    width: '300px'
  },
  plotNumber: {
    marginLeft: '30px',
    width: '170px'
  },
  dueDate: {
    display: 'flex'
  },
  amount: {
    width: '170px',
    marginLeft: '30px',
  },
  status: {
    width: '170px',
    marginLeft: '38px',
  },
  description: {
    marginLeft: '5px',
    width: '170px'
  },
  note: {
    marginLeft: '45px',
    width: '170px'
  }
});

AddInvoices.propTypes = {
  userId: PropTypes.string.isRequired
}
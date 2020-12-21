import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import PhoneIcon from '@material-ui/icons/Phone'
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'
import { css, StyleSheet } from 'aphrodite'
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import ReactGA from 'react-ga';
import { CreateNote } from '../graphql/mutations'
import { ponisoNumber } from '../utils/constants'
import ShiftButtons from './TimeTracker/ShiftButtons'
import Avatar from './Avatar'
import UserPlotInfo from './UserPlotInfo'
import UserMerge from './User/UserMerge'
import CenteredContent from './CenteredContent'
import UserActionMenu from './User/UserActionMenu'
import UserNotes from './User/UserNote'
import UserInfo from './User/UserInfo'
import UserDetail from './User/UserDetail'
import UserStyledTabs from './User/UserTabs'
import { TabPanel } from './Tabs'
import UserFilledForms from "./User/UserFilledForms"
import UserMessages from './Messaging/UserMessages'
import InvoiceList from './Payments/InvoiceList'

export default function UserInformation({
  data,
  // eslint-disable-next-line no-unused-vars
  parcelData,
  onLogEntry,
  authState,
  sendOneTimePasscode,
  refetch,
  userId,
  router,
  accountData,
  accountRefetch
}) {
  const CSMNumber = '260974624243'
  const [tabValue, setValue] = useState('Contacts')
  const [anchorEl, setAnchorEl] = useState(null)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote)
  const { handleSubmit, register } = useForm()
  const location = useLocation()

  const onSaveNote = ({ note }) => {
    const form = document.getElementById('note-form')
    noteCreate({
      variables: { userId, body: note, flagged: false }
    }).then(() => {
      refetch()
      form.reset()
    })
  }
  
  const open = Boolean(anchorEl)
  const userType = authState.user.userType.toLowerCase()

  const handleChange = (_event, newValue) => {
    setValue(newValue)
    const pages = {
      Contacts: 'Contacts',
      Notes: 'Notes',
      Communication: 'Communication',
      Plots: 'Plots',
      Payments: 'Payments',
      Forms: 'Forms'
    }
    if (location.pathname.includes('/user')) {
      const [, rootURL, , userPage] = location.pathname.split('/')
      const pageHit = `/${rootURL}/${userPage}/${pages[newValue]}`
      ReactGA.pageview(pageHit)
    }
  }
  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleMergeDialog() {
    // close the menu
    setAnchorEl(null)
    setDialogOpen(!isDialogOpen)
  }

  function sendOTP() {
      sendOneTimePasscode({
        variables: { userId }
      })
        .then(_data => {
          router.push('/otp_sent', {
            url: _data.data.oneTimeLogin.url,
            user: data.user.name,
            success: true
          })
        })
        .catch(() => {
          // alert('Make sure the user has a phone number')
          router.push('/otp_sent', {
            url: 'The user has no Phone number added',
            user: data.user.name,
            success: false
          })
        })
  }
  return (
    <div>
      <>

        <Dialog
          open={isDialogOpen}
          fullWidth
          maxWidth="md"
          scroll="paper"
          onClose={handleMergeDialog}
          aria-labelledby="user_merge"
        >
          <DialogTitle id="user_merge">
            <CenteredContent>
              <span>Merge Users</span>
            </CenteredContent>
          </DialogTitle>
          <DialogContent>
            <UserMerge close={handleMergeDialog} userId={userId} />
          </DialogContent>
        </Dialog>

        <div className="container">
          <div className="row d-flex justify-content-between">
            <div className="col-4 ">
              <Avatar 
                user={data.user} 
                // eslint-disable-next-line react/style-prop-object
                style="small"
              />
            </div>

            <UserDetail data={data} userType={userType} />

            <div className="col-2 ml-auto">
              {Boolean(authState.user.userType !== 'security_guard') && (
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleOpenMenu}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
              {/* Menu */}
              <UserActionMenu
                data={data}
                router={router}
                anchorEl={anchorEl}
                handleClose={handleClose}
                userType={userType}
                sendOTP={sendOTP}
                CSMNumber={CSMNumber}
                open={open}
                OpenMergeDialog={handleMergeDialog}
                linkStyles={css(styles.linkItem)}
              />
            </div>
          </div>
          <br />
          {authState.user.userType === 'custodian' &&
            ['security_guard', 'contractor'].includes(data.user.userType) && (
              <ShiftButtons userId={userId} />
            )}
        </div>
        {/* tabValue, handleChange, userType, data  */}
        <UserStyledTabs tabValue={tabValue} handleChange={handleChange} userType={userType} />

        <TabPanel value={tabValue} index="Contacts">
          {/* userinfo */}
          <UserInfo user={data.user} userType={authState.user.userType} />
        </TabPanel>
        {['admin'].includes(userType) && (
          <>
            <TabPanel value={tabValue} index="Notes">
              <div className="container">
                <form id="note-form">
                  <div className="form-group">
                    Notes
                    <br />
                    <textarea
                      className="form-control"
                      placeholder="Add your notes here"
                      id="notes"
                      rows="4"
                      ref={register({ required: true })}
                      name="note"
                    />
                  </div>
                  <button
                    type="button"
                    style={{ float: 'right' }}
                    className="btn btn-outline-primary "
                    onClick={handleSubmit(onSaveNote)}
                    disabled={mutationLoading}
                  >
                    {mutationLoading ? 'Saving ...' : 'Save'}
                  </button>
                </form>
                <br />
                <br />
                <UserNotes tabValue={tabValue} userId={data.user.id} />
              </div>
            </TabPanel>

            <TabPanel value={tabValue} index="Communication">
              <UserMessages />
            </TabPanel>
          </>
        )}
        {
          !['security_guard', 'custodian'].includes(userType) && (
            <>
              <TabPanel value={tabValue} index="Plots">
                <UserPlotInfo account={accountData?.user.accounts} userId={data.user.id} refetch={accountRefetch} userType={userType} />
              </TabPanel>
              <TabPanel value={tabValue} index="Forms">
                <UserFilledForms userFormsFilled={data.user.formUsers} userId={data.user.id} />
              </TabPanel>
            </>
          )
        }
        <TabPanel value={tabValue} index="Payments">
          {/* <AddInvoice data={parcelData} userId={userId} user={authState.user} /> */}
          <InvoiceList invoices={accountData?.user.invoices} />
        </TabPanel>

        <div className="container d-flex justify-content-between">
          {data.user.state === 'valid' &&
          authState.user.userType === 'security_guard' ? (
            <Button
              id="log-entry"
              className={`${css(styles.logButton)}`}
              onClick={onLogEntry}
            >
              Log This Entry
            </Button>
          ) : null}

          {authState.user.userType === 'security_guard' ? (
            <Button
              id="call_poniso"
              startIcon={<PhoneIcon />}
              className={`${css(styles.callButton)}`}
              href={`tel:${ponisoNumber}`}
            >
              Call Poniso
            </Button>
          ) : null}
        </div>
      </>
    </div>
  )
}

const User = {
  id: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  accounts: PropTypes.array,
  formUsers: PropTypes.array
}

UserInformation.propTypes = {
  data: PropTypes.shape({ user: User }).isRequired,
  onLogEntry: PropTypes.func.isRequired,
  authState: PropTypes.shape({ user: User }).isRequired,
  sendOneTimePasscode: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  router: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  accountData: PropTypes.shape({ user: User }).isRequired,
  accountRefetch: PropTypes.func.isRequired,
  parcelData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    parcelNumber: PropTypes.string.isRequired
  })).isRequired
}


const styles = StyleSheet.create({
  linkItem: {
    color: '#000000',
    textDecoration: 'none'
  },
  logButton: {
    backgroundColor: '#69ABA4',
    color: '#FFF'
  },
  callButton: {
    backgroundColor: '#FF6347',
    color: '#FFF'
  },
})

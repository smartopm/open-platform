/* eslint-disable */
import React, { Fragment, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import UserPlotInfo from './UserPlotInfo'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Avatar from './Avatar'
import PhoneIcon from '@material-ui/icons/Phone'
import ShiftButtons from './TimeTracker/ShiftButtons'
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'
import { ponisoNumber } from '../utils/constants.js'
import { css, StyleSheet } from 'aphrodite'
import { useQuery } from 'react-apollo'
import { CreateNote, UpdateNote } from '../graphql/mutations'
import { useMutation } from 'react-apollo'
import Loading from './Loading.jsx'
import UserCommunication from './UserCommunication'
import ReactGA from 'react-ga';
import UserMerge from './User/UserMerge'
import CenteredContent from './CenteredContent'
import UserActionMenu from './User/UserActionMenu'
import UserNotes from './User/UserNote'
import UserInfo from './User/UserInfo'
import UserDetail from './User/UserDetail'
import UserStyledTabs from './User/UserTabs'
import { TabPanel } from './Tabs'
import UserFilledForms from '../components/User/UserFilledForms'


export default function UserInformation({
  data,
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
  const [isLoading, setLoading] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote)
  const [noteUpdate] = useMutation(UpdateNote)
  const { handleSubmit, register } = useForm()
  let location = useLocation()

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
      let [, rootURL, , userPage] = location.pathname.split('/')
      let pageHit = `/${rootURL}/${userPage}/${pages[newValue]}`
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
      <Fragment>

        <Dialog
          open={isDialogOpen}
          fullWidth={true}
          maxWidth={'md'}
          scroll={'paper'}
          onClose={handleMergeDialog}
          aria-labelledby="user_merge"
        >
          <DialogTitle id="user_merge">
            <CenteredContent>
              <span>Merge Users</span>
            </CenteredContent>
          </DialogTitle>
          <DialogContent>
            <UserMerge close={handleMergeDialog} userId={userId}/>
          </DialogContent>
        </Dialog>

        <div className="container">
          <div className="row d-flex justify-content-between">
            <div className="col-4 ">
              <Avatar user={data.user} style="small" />
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
          {/*  <ShiftButtons userId={userId} /> */}
          <br />
          {authState.user.userType === 'custodian' &&
            ['security_guard', 'contractor'].includes(data.user.userType) && (
              <ShiftButtons userId={userId} />
            )}
        </div>
          {/* tabValue, handleChange, userType, data  */}
        <UserStyledTabs tabValue={tabValue} handleChange={handleChange} userType={userType} />

        <TabPanel value={tabValue} index={'Contacts'}>
          {/* userinfo */}
          <UserInfo data={data} userType={authState.user.userType} />
        </TabPanel>
        {['admin'].includes(userType) && (
          <>
            <TabPanel value={tabValue} index={'Notes'}>
              <div className="container">
                <form id="note-form">
                  <div className="form-group">
                    <label htmlFor="notes">Notes</label>
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
                    {/* Save */}
                    {mutationLoading ? 'Saving ...' : 'Save'}
                  </button>
                </form>
                <br />
                <br />
                <UserNotes userId={data.user.id} />
              </div>
            </TabPanel>

            <TabPanel value={tabValue} index={'Communication'}>
              <UserCommunication
                user={authState.user}
                phoneNumber={data.user.phoneNumber}
              />
            </TabPanel>
          </>
        )}
        {
          !['security_guard', 'custodian'].includes(userType) && (
            <>
            <TabPanel value={tabValue} index={'Plots'}>
              <UserPlotInfo account={accountData?.user.accounts} userId={data.user.id} refetch={accountRefetch} userType={userType}/>
            </TabPanel>
            <TabPanel value={tabValue} index={'Forms'}>
              <UserFilledForms userFormsFilled={data.user.formUsers} userId={data.user.id} />
            </TabPanel>
            </>
          )
        }
        <TabPanel value={tabValue} index={'Payments'}>
          <h4 className="text-center">Coming soon</h4>
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
      </Fragment>
    </div>
  )
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

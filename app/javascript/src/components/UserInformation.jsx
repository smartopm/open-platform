import React, { Fragment, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { UserPlotInfo } from './UserPlotInfo'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Status from './StatusBadge'
import Avatar from './Avatar'
import DateUtil from '../utils/dateutil.js'
import AddBoxIcon from '@material-ui/icons/AddBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Tooltip from '@material-ui/core/Tooltip'
import CaptureTemp from './CaptureTemp'
import PhoneIcon from '@material-ui/icons/Phone';
import ShiftButtons from './TimeTracker/ShiftButtons'
import { ponisoNumber } from '../utils/constants.js'
import { StyledTabs, TabPanel } from './Tabs'
import { css, StyleSheet } from 'aphrodite'
import { CreateNote, UpdateNote } from '../graphql/mutations'
import { withStyles, Tab } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import Loading from './Loading.jsx'
import UserCommunication from './UserCommunication'
import ReactGA from 'react-ga';
import UserLabels from './UserLabels'


export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    color: 'inherit'
  }
})(props => <Tab {...props} />)

export default function UserInformation({
  data,
  onLogEntry,
  authState,
  sendOneTimePasscode,
  refetch,
  userId,
  router
}) {
  const CSMNumber = '260974624243'
  const [tabValue, setValue] = useState('Contacts')
  const [anchorEl, setAnchorEl] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote)
  const [noteUpdate] = useMutation(UpdateNote)
  const { handleSubmit, register } = useForm()
  let location = useLocation();
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
  const userType = authState.user.userType.toLowerCase();

  const handleChange = (_event, newValue) => {
    setValue(newValue)
    const pages = {
      Contacts: 'Contacts',
      Notes: 'Notes',
      Communication: 'Communication',
      Plots: 'Plots',
      Payments: 'Payments'
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

  function handleFlagNote(id) {
    setLoading(true)
    noteUpdate({ variables: { id, flagged: true } }).then(() => {
      setLoading(false)
      refetch()
    })
  }

  function handleOnComplete(id, isCompleted) {
    setLoading(true)
    noteUpdate({ variables: { id, completed: !isCompleted } }).then(() => {
      setLoading(false)
      refetch()
    })
  }

  return (
    <div>
      <Fragment>
        <div className="container">
          <div className="row d-flex justify-content-between">
            <div className="col-4 ">
              <Avatar user={data.user} style="small" />
            </div>

            <div className="col-4">
              <h5>{data.user.name}</h5>
              <div className="expires">
                Expiration:{' '}
                {DateUtil.isExpired(data.user.expiresAt) ? (
                  <span className="text-danger">Already Expired</span>
                ) : (
                    DateUtil.formatDate(data.user.expiresAt)
                  )}
              </div>
              <div className="expires">
                Last accessed: {DateUtil.formatDate(data.user.lastActivityAt)}
              </div>
              {['admin'].includes(userType) && (
                <Link to={`/entry_logs/${data.user.id}`}>Entry Logs &gt;</Link>
              )}
              <br />
              {DateUtil.isExpired(data.user.expiresAt) ? (
                <p className={css(styles.badge, styles.statusBadgeBanned)}>
                  Expired
                </p>
              ) : (
                  ['admin'].includes(userType) && (
                    <Status label={data.user.state} />
                  )
                )}
                <UserLabels userId={data.user.id} />
            </div>

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
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    width: 200
                  }
                }}
              >
                {['admin', 'resident', 'client'].includes(userType) ? (
                  <div>
                    {['admin'].includes(userType) && (
                      <>
                        <MenuItem id='edit_button'
                          key={'edit_user'}
                          onClick={() => router.push(`/user/${data.user.id}/edit`)}
                        >
                          Edit
                          </MenuItem>
                        <MenuItem key={'send_sms'}>
                          <Link
                            to={{
                              pathname: `/message/${data.user.id}`,
                              state: {
                                clientNumber: data.user.phoneNumber,
                                clientName: data.user.name,
                                from: 'user_profile'
                              }
                            }}
                            className={css(styles.linkItem)}
                          >
                            Send SMS to {data.user.name}
                          </Link>
                        </MenuItem>

                        {data.user.phoneNumber ? (
                          <MenuItem key={'call_user'}>
                            <a
                              className={css(styles.linkItem)}
                              href={`tel:+${data.user.phoneNumber}`}
                            >
                              Call {data.user.name}
                            </a>
                          </MenuItem>
                        ) : null}
                        <MenuItem key={'user_logs'}>
                          <Link
                            to={`/user/${data.user.id}/logs`}
                            className={css(styles.linkItem)}
                          >
                            User Logs
                            </Link>
                        </MenuItem>
                      </>
                    )}
                    {['admin', 'client', 'resident'].includes(userType) && (
                      <>
                        <MenuItem key={'message_support'}>
                          <Link
                            to={{
                              pathname: `/message/${data.user.id}`,
                              state: {
                                clientName: 'Contact Support',
                                clientNumber: CSMNumber,
                                from: 'user_profile'
                              }
                            }}
                            className={css(styles.linkItem)}
                          >
                            Message Support
                          </Link>
                        </MenuItem>
                        <MenuItem key={'print'}>
                          <Link
                            to={`/print/${data.user.id}`}
                            className={css(styles.linkItem)}
                          >
                            Print
                        </Link>
                        </MenuItem>
                        <MenuItem key={'send_code'}>
                          <a
                            onClick={() => {
                              setLoading(true)
                              sendOneTimePasscode({
                                variables: { userId }
                              })
                                .then(_data => {
                                  setLoading(false)
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
                            }}
                            className={css(styles.linkItem)}
                          >
                            Send One Time Passcode
                        </a>
                        </MenuItem>
                      </>)}

                  </div>
                ) : null}
              </Menu>
            </div>
          </div>
          {/*  <ShiftButtons userId={userId} /> */}
          <br />
          {authState.user.userType === 'custodian' &&
            ['security_guard', 'contractor'].includes(data.user.userType) && (
              <ShiftButtons userId={userId} />
            )}
        </div>

        <StyledTabs
          value={tabValue}
          onChange={handleChange}
          aria-label="request tabs"
          centered
        >
          <StyledTab label="Contact" value={'Contacts'} />
          {['admin'].includes(userType) && (
            <StyledTab label="Notes" value={'Notes'} />
          )}
          {['admin'].includes(userType) && (
            <StyledTab label="Communication" value={'Communication'} />
          )}
          <StyledTab label="Plots" value={'Plots'} />
          <StyledTab label="Payments" value={'Payments'} />
        </StyledTabs>

        <TabPanel value={tabValue} index={'Contacts'}>
          <div className="container">
            <div className="form-group">
              <label className="bmd-label-static" htmlFor="name">
                Name
                </label>
              <input
                className="form-control"
                type="text"
                defaultValue={data.user.name}
                name="name"
                disabled
              />
            </div>
            <div className="form-group">
              <label className="bmd-label-static" htmlFor="Accounts">
                Accounts
                </label>
              <input
                className="form-control"
                type="text"
                defaultValue={data.user.name}
                name="accounts"
                disabled
              />
            </div>
            <div className="form-group">
              <label className="bmd-label-static" htmlFor="phoneNumber">
                Phone Number
                </label>
              <input
                className="form-control"
                type="text"
                defaultValue={data.user.phoneNumber}
                name="phoneNumber"
                disabled
              />
            </div>
            <div className="form-group">
              <label className="bmd-label-static" htmlFor="email">
                Email
                </label>
              <input
                className="form-control"
                type="email"
                defaultValue={data.user.email}
                name="email"
                disabled
              />
            </div>
            <br />
            {authState.user.userType === 'security_guard' && (
              <div className="container row d-flex justify-content-between">
                <span>Social: </span> <br />
                <CaptureTemp refId={data.user.id} refName={data.user.name} refType="User" />
              </div>
            )}
          </div>
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
                {isLoading ? (
                  <Loading />
                ) : data.user.notes ? (
                  data.user.notes.map(note => (

                    <Fragment key={note.id}>
                      <div className={css(styles.commentBox)}>
                        <p className="comment">{note.body}</p>
                        <i>created at: {DateUtil.formatDate(note.createdAt)}</i>
                      </div>

                      {note.completed ? (
                        <span
                          className={css(styles.actionIcon)}
                          onClick={() => handleOnComplete(note.id, note.completed)}
                        >
                          <Tooltip title="Mark this note as incomplete">
                            <CheckBoxIcon />
                          </Tooltip>
                        </span>
                      ) : !note.flagged ? (
                        <span />
                      ) : (
                            <span
                              className={css(styles.actionIcon)}
                              onClick={() => handleOnComplete(note.id, note.completed)}
                            >
                              <Tooltip title="Mark this note complete">
                                <CheckBoxOutlineBlankIcon />
                              </Tooltip>
                            </span>
                          )}
                      {!note.flagged && (
                        <span
                          className={css(styles.actionIcon)}
                          onClick={() => handleFlagNote(note.id)}
                        >
                          <Tooltip title="Flag this note as a todo ">
                            <AddBoxIcon />
                          </Tooltip>
                        </span>
                      )}
                      <br />
                    </Fragment>
                  ))
                ) : (
                      'No Notes Yet'
                    )}
              </div>
            </TabPanel>

            <TabPanel value={tabValue} index={'Communication'}>

              <UserCommunication user={authState.user} phoneNumber={data.user.phoneNumber} />

            </TabPanel>

          </>
        )}
        <TabPanel value={tabValue} index={'Plots'}>
          <UserPlotInfo accounts={data.user.accounts} />
        </TabPanel>
        <TabPanel value={tabValue} index={'Payments'}>
          <h4 className="text-center">Coming soon</h4>
        </TabPanel>

        <div className="container d-flex justify-content-between">

          {data.user.state === 'valid' &&
            authState.user.userType === 'security_guard' ? (
              <Button id="log-entry" className={`${css(styles.logButton)}`} onClick={onLogEntry}>
                Log This Entry
              </Button>) : null}

          {authState.user.userType === 'security_guard' ? (
            <Button id="call_poniso" startIcon={<PhoneIcon />} className={`${css(styles.callButton)}`} href={`tel:${ponisoNumber}`}>
              Call Poniso
            </Button>) : null}

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
  commentBox: {
    borderLeft: '2px solid #25c0b0',
    padding: '0.5%',
    color: 'gray'
  },
  logButton: {
    backgroundColor: '#25c0b0',
    color: '#FFF'
  },
  callButton: {
    backgroundColor: '#FF6347',
    color: '#FFF'
  },
  actionIcon: {
    float: 'right',
    cursor: 'pointer',
    ':hover': {
      color: '#25c0b0'
    },
    marginRight: 12
  },
  badge: {
    margin: '0',
    padding: '0 0.7em',
    borderRadius: '14px'
  },
  statusBadgeBanned: {
    border: '1px solid #ed5757',
    color: '#fff',
    backgroundColor: '#ed5757'
  }
})
import React, { Fragment, useContext, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { withStyles, Tab } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { a11yProps, StyledTabs, TabPanel } from '../components/Tabs'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import Nav from '../components/Nav'
import Loading from '../components/Loading.jsx'
import Status from '../components/StatusBadge'
import Avatar from '../components/Avatar'
import DateUtil from '../utils/dateutil.js'
import AddBoxIcon from '@material-ui/icons/AddBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Tooltip from '@material-ui/core/Tooltip'

import { UserQuery } from '../graphql/queries'
import {
  AddActivityLog,
  SendOneTimePasscode,
  DeleteUser,
  CreateNote,
  UpdateNote
} from '../graphql/mutations'
import { css, StyleSheet } from 'aphrodite'
import ErrorPage from '../components/Error.jsx'
import { ponisoNumber } from '../utils/constants.js'


export default ({ match, history }) => {
  const id = match.params.id
  const authState = useContext(AuthStateContext)
  const { loading, error, data, refetch } = useQuery(UserQuery, {
    variables: { id }
  })
  const [addLogEntry, entry] = useMutation(AddActivityLog, {
    variables: { userId: id }
  })
  const [deleteUser] = useMutation(DeleteUser, {
    variables: { id: id },
    onCompleted: () => {
      history.push('/')
    }
  })
  const [sendOneTimePasscode] = useMutation(SendOneTimePasscode)

  if (loading || entry.loading) return <Loading />
  if (entry.data) return <Redirect to="/" />
  if (error) return <ErrorPage title={error} />
  return (
    <Component
      data={data}
      authState={authState}
      onLogEntry={addLogEntry}
      onDelete={deleteUser}
      sendOneTimePasscode={sendOneTimePasscode}
      refetch={refetch}
      userId={id}
      router={history}
    />
  )
}

export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    color: 'inherit'
  }
})(props => <Tab {...props} />)

export function Component({
  data,
  onLogEntry,
  onDelete,
  authState,
  sendOneTimePasscode,
  refetch,
  userId,
  router
}) {
  const [tabValue, setValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote)
  const [noteUpdate] = useMutation(UpdateNote)

  const { handleSubmit, register } = useForm()
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

  const handleChange = (_event, newValue) => {
    setValue(newValue)
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
      <Nav navName="Identification" menuButton="cancel" />
      <Fragment>
        <div className="container">
          <div className="row d-flex justify-content-between">
            <div className="col-4 ">
              <Avatar user={data.user} style="small" />
            </div>

            <div className="col-4">
              <h5>{data.user.name}</h5>
              <div className="expires">
                Expiration: {DateUtil.isExpired(data.user.expiresAt) ? <span className='text-danger'>Already Expired</span> : DateUtil.formatDate(data.user.expiresAt)}
              </div>
              <div className="expires">
                Last accessed: {DateUtil.formatDate(data.user.lastActivityAt)}
              </div>
              <Link to={`/entry_logs/${data.user.id}`}>Entry Logs &gt;</Link>
              <br />
              {
                DateUtil.isExpired(data.user.expiresAt) ? (
                  <p className={css(styles.badge, styles.statusBadgeBanned)}>
                    Expired
                  </p>
                )
                  :
                  <Status label={data.user.state} />
              }
            </div>
            <div className="col-2 ml-auto">
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
              >
                <MoreVertIcon />
              </IconButton>
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
                {data.user.state === 'valid' &&
                  authState.user.userType === 'security_guard' ? (
                    <MenuItem key={'log_entry'} onClick={onLogEntry}>
                      Log This Entry
                    </MenuItem>
                  ) : null}
                {authState.user.userType === 'security_guard' ? (
                  <MenuItem key={'call_p'}>
                    <a
                      href={`tel:${ponisoNumber}`}
                      className={` ${css(styles.callButton)}`}
                    >
                      Call Poniso
                    </a>
                  </MenuItem>
                ) : null}

                {authState.user.userType === 'admin' ? (
                  <div>
                    <MenuItem key={'edit_user'}>
                      <Link
                        to={`/user/${data.user.id}/edit`}
                        className={css(styles.linkItem)}
                      >
                        Edit
                      </Link>
                    </MenuItem>
                    <MenuItem key={'send_sms'}>
                      <Link
                        to={{
                          pathname: `/message/${data.user.id}`,
                          state: { clientNumber: data.user.phoneNumber }
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
                          }).then(_data => {
                            setLoading(false)
                            router.push('/otp_sent', {
                              url: _data.data.oneTimeLogin.url,
                              user: data.user.name,
                              success: true
                            })
                          }).catch(() => {
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
                    <MenuItem key={'delete'}>
                      <a
                        onClick={() => {
                          if (
                            window.confirm(
                              'Are you sure you wish to delete this user?'
                            )
                          )
                            onDelete()
                        }}
                        className={css(styles.linkItem)}
                      >
                        Delete
                      </a>
                    </MenuItem>
                  </div>
                ) : null}
              </Menu>
            </div>
          </div>
        </div>

        <StyledTabs
          value={tabValue}
          onChange={handleChange}
          aria-label="request tabs"
          centered
        >
          <StyledTab label="Contact" {...a11yProps(0)} />
          <StyledTab label="Notes" {...a11yProps(1)} />
          <StyledTab label="Plots" {...a11yProps(2)} />
          <StyledTab label="Payments" {...a11yProps(3)} />
        </StyledTabs>

        <TabPanel value={tabValue} index={0}>
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
            Social: <br />
          </div>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
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
        <TabPanel value={tabValue} index={2}>
          <h4 className="text-center">Coming soon</h4>
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <h4 className="text-center">Coming soon</h4>
        </TabPanel>
      </Fragment>
    </div>
  )
}

const styles = StyleSheet.create({
  logButton: {
    backgroundColor: '#25c0b0',
    textTransform: 'unset'
  },
  callButton: {
    color: '#ed5757',
    textTransform: 'unset',
    textDecoration: 'none'
  },
  linkItem: {
    color: '#000000',
    textDecoration: 'none'
  },
  commentBox: {
    borderLeft: '2px solid #25c0b0',
    padding: '0.5%',
    color: 'gray'
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

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
import ScheduleIcon from '@material-ui/icons/Schedule';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';


import { UserQuery } from '../graphql/queries'
import {
  AddActivityLog,
  SendOneTimePasscode,
  DeleteUser,
  createNote
} from '../graphql/mutations'
import { css, StyleSheet } from 'aphrodite'
import ErrorPage from '../components/Error.jsx'
import { ponisoNumber } from '../utils/constants.js'

function formatDate(datetime) {
  if (datetime) {
    const date = DateUtil.fromISO8601(datetime)
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    )
  }
  return 'Never'
}

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
  const [sendOneTimePasscode] = useMutation(SendOneTimePasscode, {
    variables: { userId: id }
  })

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
  userId
}) {
  const [tabValue, setValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [noteCreate, { loading: mutationLoading }] = useMutation(createNote)

  const { handleSubmit, register } = useForm()
  const onSaveNote = ({ note }) => {
    const form = document.getElementById('note-form')
    noteCreate({
      variables: { userId, body: note, flagged: true }
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
  function handleNoteAction(){
    // handle the note actions here
    console.log('note clicked ')
  }

  console.table(data.user.notes)
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
                Exp: {formatDate(data.user.expiresAt)}
              </div>
              <div className="expires">
                Last accessed: {formatDate(data.user.lastActivityAt)}
              </div>
              <Link to={`/entry_logs/${data.user.id}`}>Entry Logs &gt;</Link>
              <br />
              <Status label={data.user.state} />
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
                        onClick={sendOneTimePasscode}
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
                  readOnly={authState.user.id !== userId}
                />
              </div>
              {authState.user.id === userId && (
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
              )}
            </form>
            <br />
            <br />
            {data.user.notes &&
              data.user.notes.reverse().map(note => (
                <Fragment key={note.id}>
                  <div className={css(styles.commentBox)}>
                   <p className="comment">{note.body}</p>
                   <i>created at: {formatDate(note.createdAt)}</i>
                  </div> 
                  <span className={css(styles.actionIcon)} onClick={handleNoteAction} >
                    <AddBoxIcon />
                  </span>
                  <span className={css(styles.actionIcon)} onClick={handleNoteAction} >
                    <ScheduleIcon />
                  </span>
                  <span className={css(styles.actionIcon)} onClick={handleNoteAction} >
                    <CheckBoxOutlineBlankIcon />
                  </span>
                  <span className={css(styles.actionIcon)} onClick={handleNoteAction} >
                    <CheckBoxIcon />
                  </span>
                  <br />
                </Fragment>
              ))}
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
  }
})

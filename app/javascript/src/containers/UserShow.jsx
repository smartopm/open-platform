import React, { Fragment, useContext } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { withStyles, Tab } from '@material-ui/core'
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

import { UserQuery } from '../graphql/queries'
import {
  AddActivityLog,
  SendOneTimePasscode,
  DeleteUser
} from '../graphql/mutations'
import { css, StyleSheet } from 'aphrodite'
import ErrorPage from '../components/Error.jsx'
import { ponisoNumber } from '../utils/constants.js'

function expiresAtStr(datetime) {
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
  const { loading, error, data } = useQuery(UserQuery, { variables: { id } })
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
  sendOneTimePasscode
}) {
  const [value, setValue] = React.useState(0)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  function handleOpenMenu(event) {
    // handle menu here
    setAnchorEl(event.currentTarget)
  }
  function handleClose() {
    // handle menu here
    setAnchorEl(null)
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
                <MenuItem key={'optionssdf'} onClick={onLogEntry}>
                  Log This Entry
                </MenuItem>
                <MenuItem key={'options'}>
                  <a
                    href={`tel:${ponisoNumber}`}
                    className={` ${css(styles.callButton)}`}
                  >
                    Call Poniso
                  </a>
                </MenuItem>
                <MenuItem>
                  <Link
                    to={`/user/${data.user.id}/logs`}
                    className={css(styles.linkItem)}
                  >
                    User Logs
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to={`/print/${data.user.id}`}
                    className={css(styles.linkItem)}
                  >
                    Print
                  </Link>
                </MenuItem>
                <MenuItem>
                  <a
                    onClick={sendOneTimePasscode}
                    className={css(styles.linkItem)}
                  >
                    Send One Time Passcode
                  </a>
                </MenuItem>
                <MenuItem>
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
              </Menu>
            </div>
          </div>
        </div>

        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="request tabs"
          centered
        >
          <StyledTab label="Contact" {...a11yProps(0)} />
          <StyledTab label="Notes" {...a11yProps(1)} />
          <StyledTab label="Plots" {...a11yProps(2)} />
          <StyledTab label="Payments" {...a11yProps(3)} />
        </StyledTabs>

        <TabPanel value={value} index={0}>
          <div className="container">
            Name: {data.user.name} <br />
            Accounts: {data.user.name} <br />
            Phone: {data.user.phoneNumber} <br />
            Email: {data.user.email} <br />
            Social: <br />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className="container">
            <form>
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  className="form-control"
                  placeholder="Add your notes here"
                  id="notes"
                  rows="3"
                />
              </div>
              <button
                type="button"
                style={{ float: 'right' }}
                className="btn btn-outline-primary "
              >
                Save
              </button>
            </form>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h4 className="text-center">Coming soon</h4>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <h4 className="text-center">Coming soon</h4>
        </TabPanel>
      </Fragment>
      {/*
       <div className="container">
        <div className="row justify-content-center id_card">
          <div className="card id_card_box col-10 col-sm-10 col-md-6">
            <div className="d-flex justify-content-center">
              <div className="member_type">{data.user.userType}</div>
            </div>
            <Avatar user={data.user} style="big" />
            <div className="d-flex justify-content-center">
              <h1>{data.user.name}</h1>
            </div>
            <div className="d-flex justify-content-center">
              <div className="expires">
                Exp: {expiresAtStr(data.user.expiresAt)}
              </div>
            </div>
            <div className="d-flex justify-content-center last_accessed">
              <div className="expires">
                Last accessed: {expiresAtStr(data.user.lastActivityAt)}
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <Status label={data.user.state} />
            </div>

            <div className="d-flex justify-content-center">
              <Link to={`/entry_logs/${data.user.id}`}>Entry Logs &gt;</Link>
            </div>
          </div>
        </div>

        {data.user.state === "valid" &&
          authState.user.userType === "security_guard" ? (
            <div className="row justify-content-center log-entry-form">
              <div className="col-10 col-sm-10 col-md-6">
                <a
                  className={`btn btn-primary btn-lg btn-block active ${css(
                    styles.logButton
                  )}`}
                  onClick={onLogEntry}
                >
                  Log This Entry
              </a>
              </div>
            </div>
          ) : null}
        {authState.user.userType === "security_guard" ? (
          <div className="row justify-content-center log-entry-form">
            <div className="col-10 col-sm-10 col-md-6">
              <a
                href={`tel:${ponisoNumber}`}
                className={`btn btn-primary btn-lg btn-block ${css(
                  styles.callButton
                )}`}
              >
                Call Poniso
              </a>
            </div>
          </div>
        ) : null}
        {authState.user.userType === "admin" ? (
          <Fragment>
            <div className="row justify-content-center log-entry-form">
              <div className="col-10 col-sm-10 col-md-6">
                <Link
                  to={`/user/${data.user.id}/edit`}
                  className="btn btn-primary btn-lg btn-block active"
                >
                  Edit
                </Link>
              </div>
            </div>

            {data.user.phoneNumber ? (
              <div className="row justify-content-center log-entry-form">
                <div className="col-10 col-sm-10 col-md-6">
                  <a
                    className="btn btn-primary btn-lg btn-block active"
                    href={`tel:+${data.user.phoneNumber}`}
                  >
                    Call {data.user.name}
                  </a>
                </div>
              </div>
            ) : null}

            <div className="row justify-content-center log-entry-form">
              <div className="col-10 col-sm-10 col-md-6">
                <Link
                  to={`/user/${data.user.id}/logs`}
                  className="btn btn-primary btn-lg btn-block active"
                >
                  User Logs
                </Link>
              </div>
            </div>

            <div className="row justify-content-center log-entry-form">
              <div className="col-10 col-sm-10 col-md-6">
                <Link
                  to={`/print/${data.user.id}`}
                  className="btn btn-primary btn-lg btn-block active"
                >
                  Print
                </Link>
              </div>
            </div>
            <div className="row justify-content-center log-entry-form">
              <div className="col-10 col-sm-10 col-md-6">
                <a
                  onClick={sendOneTimePasscode}
                  className="btn btn-primary btn-lg btn-block active"
                >
                  Send One Time Passcode
                </a>
              </div>
            </div>
            <div className="row justify-content-center log-entry-form">
              <div className="col-10 col-sm-10 col-md-6">
                <a
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you wish to delete this user?"
                      )
                    )
                      onDelete();
                  }}
                  className="btn btn-primary btn-lg btn-block active"
                >
                  Delete
                </a>
              </div>
            </div>
          </Fragment>
        ) : null}
      </div> */}
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
  }
})

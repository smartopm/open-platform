/* eslint-disable */
import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import { Link } from 'react-router-dom'


export default function UserActionMenu({
    data,
    router,
    anchorEl,
    handleClose,
    userType,
    sendOTP,
    CSMNumber,
    open,
    OpenMergeDialog,
    linkStyles
  }) {

    return (
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 252
          }
        }}
      >
        <div>
          {['admin'].includes(userType) && (
            <>
              <MenuItem
                key={'merge'}
                onClick={OpenMergeDialog}
              >
                Merge User
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
                  className={linkStyles}
                >
                  Send SMS to {data.user.name}
                </Link>
              </MenuItem>

              {data.user.phoneNumber ? (
                <MenuItem key={'call_user'}>
                  <a
                    className={linkStyles}
                    href={`tel:+${data.user.phoneNumber}`}
                  >
                    Call {data.user.name}
                  </a>
                </MenuItem>
              ) : null}
              <MenuItem key={'user_logs'}>
                <Link
                  to={`/user/${data.user.id}/logs`}
                  className={linkStyles}
                >
                  User Logs
                </Link>
              </MenuItem>
            </>
          )}
          {['admin', 'client', 'resident'].includes(userType) && (
            <>
              <MenuItem
                id="edit_button"
                key={'edit_user'}
                onClick={() => router.push(`/user/${data.user.id}/edit`)}
              >
                Edit
              </MenuItem>
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
                  className={linkStyles}
                >
                  Message Support
                </Link>
              </MenuItem>
              <MenuItem key={'print'}>
                <Link
                  to={`/print/${data.user.id}`}
                  className={linkStyles}
                >
                  Print
                </Link>
              </MenuItem>
              <MenuItem key={'send_code'}>
                            <a onClick={sendOTP}
                                className={linkStyles}
                            >
                  Send One Time Passcode
                </a>
              </MenuItem>
            </>
          )}
        </div>
      </Menu>
    )
  }

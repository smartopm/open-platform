/* eslint-disable */
import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * 
 * @deprecated this will be completely removed with the new design, it currently only used on /users page
 */
export default function UserActionMenu({
    data,
    router,
    anchorEl,
    handleClose,
    userType,
    CSMNumber,
    open,
    OpenMergeDialog,
    linkStyles
  }) {
    const { t } = useTranslation('common')

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
                {t('menu.merge_user')}
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
                  {t('menu.send_sms_to')} {data.user.name}
                </Link>
              </MenuItem>

              {data.user.phoneNumber ? (
                <MenuItem key={'call_user'}>
                  <a
                    className={linkStyles}
                    href={`tel:+${data.user.phoneNumber}`}
                  >
                    {t('menu.call')} {data.user.name}
                  </a>
                </MenuItem>
              ) : null}
              <MenuItem key={'user_logs'}>
                <Link
                  to={`/user/${data.user.id}/logs`}
                  className={linkStyles}
                >
                  {t('menu.user_logs')}
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
                {t('menu.user_edit')}
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
                 {t('menu.message_support')}
                </Link>
              </MenuItem>
              <MenuItem key={'print'}>
                <Link
                  to={`/print/${data.user.id}`}
                  className={linkStyles}
                >
                  {t('menu.print_id')}
                </Link>
              </MenuItem>
              <MenuItem key={'send_code'}>
                <Link
                  to={`/user/${data.user.id}/otp`}
                  className={linkStyles}
                >
                  {t('menu.send_otp')}
                </Link>
              </MenuItem>
            </>
          )}
        </div>
      </Menu>
    )
  }

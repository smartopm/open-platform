/* eslint-disable */
import React from 'react'
import { Menu, MenuItem } from '@mui/material'
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
    linkStyles,
    handleActivationDialog
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
                  style={{ textDecoration: 'none'}}
                >
                  {t('menu.send_sms_to')} {data.user.name}
                </Link>
              </MenuItem>
              {data.user.phoneNumber && (
                <MenuItem key={'call_user'}>
                  <a
                    className={linkStyles}
                    href={`tel:+${data.user.phoneNumber}`}
                    style={{ textDecoration: 'none'}}
                  >
                    {t('misc.call')} {data.user.name}
                  </a>
                </MenuItem>
              )}
              <MenuItem key={'user_logs'}>
                <Link
                  to={`/user/${data.user.id}/logs`}
                  className={linkStyles}
                  style={{ textDecoration: 'none'}}
                >
                  {t('menu.user_logs')}
                </Link>
              </MenuItem>
              <MenuItem
                key={'view_plans'}
                onClick={() => router.push(`/user/${data.user.id}?tab=Plans`)}
              >
                {t('menu.view_plans')}
              </MenuItem>
              {data.user.status === 'active' ? (
                 <MenuItem
                 key={'deactivate_user'}
                 onClick={handleActivationDialog}
               >
                 {t('menu.deactivate_user')}
               </MenuItem>
              ) : (
                <MenuItem
                key={'activate_user'}
                onClick={handleActivationDialog}
              >
                {t('menu.activate_user')}
              </MenuItem>
              )}
            </>
          )}
          {['admin', 'client', 'resident'].includes(userType) && (
            <>
              <MenuItem
                id="edit_button"
                key={'edit_user'}
                className={linkStyles}
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
                  style={{ textDecoration: 'none'}}
                >
                 {t('menu.message_support')}
                </Link>
              </MenuItem>
              <MenuItem key={'print'}>
                <Link
                  to={`/print/${data.user.id}`}
                  className={linkStyles}
                  style={{ textDecoration: 'none'}}
                >
                  {t('menu.print_id')}
                </Link>
              </MenuItem>
              <MenuItem key={'send_code'}>
                <Link
                  to={`/user/${data.user.id}/otp`}
                  className={linkStyles}
                  style={{ textDecoration: 'none'}}
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

import React, { useState } from 'react'
import { Grid, IconButton } from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import DataList from '../../../shared/list/DataList';
import MenuList from '../../../shared/MenuList'
import { dateToString } from '../../../components/DateContainer';



export default function MailTemplateItem({email, onTemplateClick, onTemplateDuplicate}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const anchorElOpen = Boolean(anchorEl)
  const { t } = useTranslation('common')
  const menuList = [
    { content: t('menu.edit'), isAdmin: true, handleClick: () => onTemplateClick(email) },
    { content: t('menu.duplicate'), isAdmin: true, handleClick: () => onTemplateDuplicate(email) },
  ];
  const menuData = {
    menuList,
    anchorEl,
    handleTemplateMenu,
    open: anchorElOpen,
    handleClose,
  }

    /*
    we will the list header to this once we change the datalist component
    { title: t('table_headers.name'), col: 2 },
    { title: t('table_headers.subject'), col: 5 },
    { title: t('table_headers.date_created'), col: 1 },
    { title: t('table_headers.tag'), col: 1 },
    { title: t('table_headers.menu'), col: 1 }
  */

  const mailListHeader = [
    { title: 'Name', col: 2 },
    { title: 'Subject', col: 5 },
    { title: 'Date Created', col: 1 },
    { title: 'Tag', col: 1 },
    { title: 'Menu', col: 1 }
  ];

  function handleTemplateMenu(event){
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return(
    <DataList
      key={email.id}
      keys={mailListHeader}
      hasHeader={false}
      data={renderEmailTemplate(email, menuData)}
    />
  );
}

/**
 *
 * @param {object} property list object
 * @param {object} menuData data used for the menu
 * @returns {object} an object with properties that DataList component uses to render
 */
 export function renderEmailTemplate(email, menuData) {
  return [
    {
      Name: (
        <Grid item xs={2} data-testid="name">
          {email.name}
        </Grid>
      ),
      Subject: (
        <Grid item xs={2} data-testid="subject">
          {email.subject}
        </Grid>
      ),
      'Date Created': (
        <Grid item xs={2} data-testid="createdat">
          {dateToString(email.createdAt)}
        </Grid>
      ),
      Tag: (
        <Grid item xs={2} data-testid="tag">
          {email.tag}
        </Grid>
      ),
      Menu: (
        <Grid item xs={2} sm={1} data-testid="menu">
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="email-template-menu"
            onClick={(event) => menuData.handleTemplateMenu(event)}
          >
            <MoreHorizIcon />
          </IconButton>
          <MenuList
            open={menuData.open}
            anchorEl={menuData.anchorEl}
            handleClose={menuData.handleClose}
            list={menuData.menuList}
          />
        </Grid>
      )
    }
  ];
}


MailTemplateItem.propTypes = {
  email: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      subject: PropTypes.string,
      tag: PropTypes.string,
  }).isRequired,
  onTemplateClick: PropTypes.func.isRequired,
  onTemplateDuplicate: PropTypes.func.isRequired
}
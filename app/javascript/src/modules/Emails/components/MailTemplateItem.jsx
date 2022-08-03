import React, { useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import DataList from '../../../shared/list/DataList';
import MenuList from '../../../shared/MenuList'
import { dateToString } from '../../../components/DateContainer';



export default function MailTemplateItem({email, onTemplateClick, onTemplateDuplicate, headers}) {
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
      keys={headers}
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
            size="large"
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
  onTemplateDuplicate: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.object).isRequired
}
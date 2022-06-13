import React, { useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import { MoreHorizOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types'
import DataList from '../../shared/list/DataList';
import Text from '../../shared/Text';
import MenuList from '../../shared/MenuList'
import { titleize } from '../../utils/helpers';

const parcelHeaders = [
  { title: 'Property Number/Property Type', col: 2 },
  { title: 'Address1/Address2', col: 3 },
  { title: 'Postal Code', col: 3 },
  { title: 'City', col: 3 },
  { title: 'State Province/Country', col: 4 },
  { title: 'Menu', col: 1 },
];

export default function ParcelItem({ parcel, onParcelClick, onAddHouseClick }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const anchorElOpen = Boolean(anchorEl)
  const menuList = [
    { content: 'Edit Property', isAdmin: true, color: '', handleClick: (e) => { onParcelClick(parcel); handleClose(e) }}
  ]
  if(parcel && parcel.objectType !== 'house') {
    menuList.unshift(
      { content: 'Add House', isAdmin: true, color: '', handleClick: (e) => { onAddHouseClick(parcel); handleClose(e) }}
    )
  }
  const menuData = {
    menuList,
    handlePropertyMenu,
    anchorEl,
    open: anchorElOpen,
    handleClose
  }

  function handlePropertyMenu(event){
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }
  return (
    <DataList
      keys={parcelHeaders}
      data={renderParcel(parcel, menuData)}
      hasHeader={false}
      clickable
      // handleClick={() => onParcelClick(parcel)}
    />
  )
}

/**
 *
 * @param {object} property list object
 * @param {object} menuData data used for the menu
 * @returns {object} an object with properties that DataList component uses to render
 */
 export function renderParcel(parcel, menuData) {
  return [
    {
      'Property Number/Property Type': (
        <Grid item xs={12} md={2} data-testid="property">
          <div style={{fontWeight: 'bold', fontSize: '12px'}}>{parcel.parcelNumber}</div>
          <Text content={parcel.parcelType} />
          <br />
          {parcel.objectType && <Text color="primary" content={`Category: ${titleize(parcel.objectType)}`} />}
          {parcel.status && <Text color="primary" content={` | Status: ${titleize(parcel.status)}`} />}
        </Grid>
      ),
      'Address1/Address2': (
        <Grid item xs={12} md={2} data-testid="address">
          <Text content={parcel.address1} />
          <br />
          <Text content={parcel.address2} />
        </Grid>
      ),
      'Postal Code': (
        <Grid item xs={12} md={2} data-testid="postal-code">
          <Text content={parcel.postalCode} />
        </Grid>
      ),
      'City': (
        <Grid item xs={12} md={2} data-testid="city">
          <Text content={parcel.city} />
        </Grid>
      ),
      'State Province/Country': (
        <Grid item xs={12} md={2} data-testid="country">
          <Text content={parcel.stateProvince} />
          <br />
          <Text content={parcel.country} />
        </Grid>
      ),
      Menu: (
        <Grid item xs={12} md={1} data-testid="menu">
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="edit_property_menu"
            onClick={(event) => menuData.handlePropertyMenu(event)}
            size="large"
          >
            <MoreHorizOutlined />
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

ParcelItem.propTypes = {
    parcel: PropTypes.shape({
        id: PropTypes.string,
        parcelNumber: PropTypes.string,
        address1: PropTypes.string,
        address2: PropTypes.string,
        city: PropTypes.string,
        postalCode: PropTypes.string,
        stateProvince: PropTypes.string,
        country: PropTypes.string,
        parcelType: PropTypes.string,
        status: PropTypes.string,
        objectType: PropTypes.string,
    }).isRequired,
    onParcelClick: PropTypes.func.isRequired,
    onAddHouseClick: PropTypes.func.isRequired
}
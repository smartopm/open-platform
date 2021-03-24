import React, { useState } from 'react'
import { Grid, IconButton } from '@material-ui/core'
import { MoreHorizOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types'
// import { makeStyles } from "@material-ui/core/styles";
import DataList from '../../shared/list/DataList';
import Text from '../../shared/Text';
import MenuList from '../../shared/MenuList'

const parcelHeaders = [
  { title: 'Property Number/Property Type', col: 2 },
  { title: 'Address1/Address2', col: 3 },
  { title: 'Postal Code', col: 3 },
  { title: 'City', col: 3 },
  { title: 'State Province/Country', col: 4 },
  { title: 'Menu', col: 1 },
];

export default function ParcelItem({ parcel, onParcelClick }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const anchorElOpen = Boolean(anchorEl)
  const menuList = [
    { content: 'Edit Property', isAdmin: true, color: '', handleClick: () => onParcelClick(parcel)}
  ]
  const menuData = {
    menuList,
    handlePropertyMenu,
    anchorEl,
    open: anchorElOpen,
    // userType: 'admin',
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
      handleClick={() => onParcelClick(parcel)}
    />
  )
}

/**
 *
 * @param {object} invoices list of tasks
 * @param {function} handleOpenMenu a function that opens the menu for each task
 * @param {object} currencyData community currencyData current and locale
 * @returns {object} an object with properties that DataList component uses to render
 */
 export function renderParcel(parcel, menuData) {
  return [
    {
      'Property Number/Property Type': (
        <Grid item xs={12} md={2} data-testid="issue_date">
          <div style={{fontWeight: 'bold', fontSize: '12px'}}>{parcel.parcelNumber}</div>
          <Text content={parcel.parcelType} />
        </Grid>
      ),
      'Address1/Address2': (
        <Grid item xs={12} md={2} data-testid="invoice_amount">
          <Text content={parcel.address1} />
          <br />
          <Text content={parcel.address2} />
        </Grid>
      ),
      'Postal Code': (
        <Grid item xs={12} md={2} data-testid="issue_date">
          <Text content={parcel.postalCode} />
        </Grid>
      ),
      'City': (
        <Grid item xs={12} md={2}>
          <Text content={parcel.city} />
        </Grid>
      ),
      'State Province/Country': (
        <Grid item xs={12} md={2} data-testid="status">
          <Text content={parcel.stateProvince} />
          <br />
          <Text content={parcel.country} />
        </Grid>
      ),
      Menu: (
        <Grid item xs={12} md={1}>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="receipt-menu"
            onClick={(event) => menuData.handlePropertyMenu(event)}
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
        parcelType: PropTypes.string
    }).isRequired,
    onParcelClick: PropTypes.func.isRequired
}

// const useStyles = makeStyles(() => ({
//   parcelItem: {
//       borderBottomStyle: 'solid',
//       borderBottomColor: '#F6F6F6',
//       borderBottom: 10,
//       backgroundColor: '#FFFFFF',
//       cursor: 'pointer'
//   },
//   parcelGrid: {
//     marginTop: '8px'
//   }
// }));
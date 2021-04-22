import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Drawer, List, ListItem, ListItemText, GridList, GridListTile, ListSubheader } from '@material-ui/core';
import { Context } from '../../containers/Provider/AuthStateProvider'
import ImageAuth from '../../shared/ImageAuth'
import { CustomizedDialogs } from '../Dialog'

export default function PointOfInterestDrawerDialog({ anchor, children, open, onClose, imageData, selectedPoi }){
  const authState = useContext(Context)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  function handleImageDialogClose(){
    setImageDialogOpen(false)
  }

  return (
    <>
      <CustomizedDialogs
        open={imageDialogOpen}
        handleModal={handleImageDialogClose}
        dialogHeader='Photo'
        handleBatchFilter={handleImageDialogClose}
        actionable={false}
      >
        <GridList cols={1}>
          {(!imageData.urls?.length) && (
            <GridListTile key="Subheader" cols={1}>
              <ListSubheader component="div">No Photos</ListSubheader>
            </GridListTile>
          )}
          {imageData.urls?.map((url) =>(
            <GridListTile key={url} cols={1} style={{ display: 'flex', justifyContent: 'center' }}>
              <ImageAuth
                key={url}
                imageLink={url}
                token={authState.token}
                className="img-responsive img-thumbnail"
              /> 
            </GridListTile>
          ))}
        </GridList>
      </CustomizedDialogs>
      <div style={{ width: '300px' }}>
        <Drawer anchor={anchor} open={open} onClose={onClose}>
          {selectedPoi ? (
            <>
              <List>
                <h4>Details</h4>
                <ListItem>
                  <b>POI:</b>
                  <ListItemText primary={selectedPoi.poiName} />
                </ListItem>
                <ListItem>
                  <b>ID:</b>
                  <ListItemText primary={selectedPoi.parcelNumber} />
                </ListItem>
                <ListItem>
                  <b>Type:</b>
                  <ListItemText primary={selectedPoi.parcelType} />
                </ListItem>
                <ListItem>
                  <b>Longitude X:</b>
                  <ListItemText primary={selectedPoi.longX} />
                </ListItem>
                <ListItem>
                  <b>Latitude Y:</b>
                  <ListItemText primary={selectedPoi.latY} />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="View Photo" onClick={() => setImageDialogOpen(true)} />
                </ListItem>
              </List>
              {children}
            </>
             ) : 'No Details'}
        </Drawer>
      </div>
    </>
  )
}

PointOfInterestDrawerDialog.defaultProps ={
  anchor: 'right',
  children: [],
  imageData: {
    url: '',
    loading: false,
  },
  selectedPoi: null,
}

PointOfInterestDrawerDialog.propTypes = {
  selectedPoi: PropTypes.shape({
    poiName: PropTypes.string,
    parcelNumber: PropTypes.string,
    parcelType: PropTypes.string,
    longX: PropTypes.number,
    latY: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  anchor: PropTypes.string,
  children: PropTypes.node,
  imageData: PropTypes.shape({
    urls: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool
  })
}
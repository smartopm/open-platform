import React from 'react'
import PropTypes from 'prop-types'
import { MapEditorFullScreenDialog } from '../Dialog'
import MapEditor from '../Map/MapEditor'

export default function LandParcelEditCoordinate({ open, handleClose, handleSaveMapEdit }){
  return (
    <>
      <div>
        <MapEditorFullScreenDialog open={open} handleClose={handleClose} title='Map Editor'>
          <div>
            <MapEditor handleSaveMapEdit={handleSaveMapEdit} />
          </div>
        </MapEditorFullScreenDialog>
      </div>
    </>
  )
}

 LandParcelEditCoordinate.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSaveMapEdit: PropTypes.func.isRequired,
}
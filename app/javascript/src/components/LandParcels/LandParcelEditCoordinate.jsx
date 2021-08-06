import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { MapEditorFullScreenDialog } from '../Dialog'
import MapEditor from '../Map/MapEditor'

export default function LandParcelEditCoordinate({ open, handleClose, handleSaveMapEdit }){
  const { t } = useTranslation('property')
  return (
    <>
      <div>
        <MapEditorFullScreenDialog open={open} handleClose={handleClose} title={t('misc.map_editor')}>
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
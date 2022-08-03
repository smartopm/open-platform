import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import PropTypes from 'prop-types'
import { getCroppedImg } from '../../../utils/imageResizer'

/* istanbul ignore next */
export default function ImageCropper({ getBlob, inputImg, fileName }){
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const onCropComplete = async (_, croppedAreaPixels) => {
  const croppedImage = await getCroppedImg(
    inputImg,
    croppedAreaPixels
  )
    croppedImage.name = fileName 
    getBlob(croppedImage)
  }

  return(
    <>
      <div style={{height: '150px', marginLeft: '140px'}} data-testid='cropper'>
        <Cropper
          image={inputImg}
          crop={crop}
          zoom={zoom}
          aspect={4/1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
    </>
  )
}

ImageCropper.propTypes = {
  fileName: PropTypes.string.isRequired,
  inputImg: PropTypes.string.isRequired,
  getBlob: PropTypes.func.isRequired
}
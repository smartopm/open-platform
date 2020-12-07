/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../utils/imageResizer'



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
      <div style={{height: '150px', marginLeft: '140px'}}>
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
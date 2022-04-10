/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react'
import QrReader from 'react-qr-reader'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FormControlLabel, Switch, Typography } from '@mui/material'
import { Footer } from '../components/Footer'
import { Context } from './Provider/AuthStateProvider.js'
import { extractHostname } from '../utils/helpers'
import CenteredContent from '../shared/CenteredContent'

/* istanbul ignore next */
export default function QRScan({ isKiosk }) {
  const [scanned, setScanned] = useState(false)
  const [error, setError] = useState(null)
  const [isTorchOn, setToggleTorch] = useState(false)
  const { t } = useTranslation(['scan', 'common'])
  const authState = useContext(Context)

  // automatically grant access when using this from kiosk mode

  useEffect(() => {
    const video = document.querySelector('video')
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setError(t('common:errors.camera_not_supported'))
      return
    }
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'environment'
        }
      })
      .then(stream => {
        video.srcObject = stream

        // get the active track of the stream
        const track = stream.getVideoTracks()[0]

        video.addEventListener('loadedmetadata', () => {
          if(track.getCapabilities){
            window.setTimeout(
              () => onCapabilitiesReady(track.getCapabilities()),
              500
            )
          }
        })

        function onCapabilitiesReady(capabilities) {
          if (capabilities.torch) {
            track
              .applyConstraints({
                advanced: [{ torch: isTorchOn }]
              })
              .catch(e => {
                setError(JSON.stringify(e))
                return
              })
          } else {
           setError(isTorchOn && t('common:errors.flashlight_not_supported'))
          return
          }
        }
      })
      .catch(err => {
        setError(JSON.stringify(err))
        return
      })
  }, [isTorchOn])

  const handleScan = data => {
    if (data) {
      if (window.location.hostname !== extractHostname(data)) {
        setError(t('common:errors.invalid_qr_data'))
        return
      }
      setScanned(true)
      window.location = data
    }
  }

  const handleError = err => {
    console.error(err)
  }

  // TODO: Replace this with permissions
  if (!['security_guard', 'admin', 'custodian', 'security_supervisor'].includes(authState.user.userType.toLowerCase())) {
    return <Redirect to='/' />
  }

  return (
    <div>
      {scanned ? (
        <h1 className="text-center">{t('misc.decoding')}</h1>
      ) : (
          <>
            {error && <p className="text-center text-danger">{error}</p>}
            <video
              style={{
                display: 'none'
              }}
            ></video>

            {/* <CenteredContent>
              <Typography variant="h6" textAlign="center">
                Please center you OR code on the
              </Typography>
            </CenteredContent> */}
            <QrReader
              delay={100}
              torch={true}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />

            <div
              className="row justify-content-center align-items-center "
              style={{
                marginTop: 60
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isTorchOn}
                    onChange={() => setToggleTorch(!isTorchOn)}
                  />
                }
                label={t('scan.torch')}
              />
            </div>
          </>
        )}
      <Footer position="5vh" />
    </div>
  )
}

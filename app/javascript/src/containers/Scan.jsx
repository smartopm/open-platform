import React, { useState, useEffect, useContext } from 'react'
import QrReader from 'react-qr-reader'
import PropTypes from 'prop-types'
import { Redirect, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FormControlLabel, Switch, Typography } from '@mui/material'
import { useMutation } from 'react-apollo'
import { Footer } from '../components/Footer'
import { Context } from './Provider/AuthStateProvider'
import { extractHostname } from '../utils/helpers'
import { AddActivityLog } from '../graphql/mutations'
import useTimer from '../utils/customHooks'
import CenteredContent from '../shared/CenteredContent'

/* istanbul ignore next */
export default function QRScan({ isKiosk }) {
  const [scanned, setScanned] = useState(false)
  const [error, setError] = useState(null)
  const [isTorchOn, setToggleTorch] = useState(false)
  const { t } = useTranslation(['scan', 'common'])
  const authState = useContext(Context)
  const history = useHistory()
  const [addLogEntry] = useMutation(AddActivityLog);
  const time = useTimer(15)

  const status = {
    denied: 'error',
    success: 'success',
    error: 'error'
  }

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
                
              })
          } else {
           setError(isTorchOn && t('common:errors.flashlight_not_supported'))
          
          }
        }
      })
      .catch(err => {
        setError(JSON.stringify(err))
        
      })
  }, [isTorchOn])


  // Reroute to error page if 15sec run out
  useEffect(() => {
    if(time === 0){
      history.push(`/logbook/kiosk/error?status=timeout`) 
    }
  }, [time])

  // automatically grant access when using this from kiosk mode
  const handleScan = data => {
    if (data) {
      if (window.location.hostname !== extractHostname(data).hostname) {
        setError(t('common:errors.invalid_qr_data'))
        return
      }
      setScanned(true)
      if(isKiosk) {
        addLogEntry({ variables: { userId: extractHostname(data).userId } })
        .then((response) => {
          return history.push(`/logbook/kiosk/${status[response.data.activityLogAdd.status]}`)
        })
        .catch(() => {
          return history.push(`/logbook/kiosk/error`)
        })
      } else {
         window.location = data
      }
    }
  }

  const handleError = err => {
    setError(err)
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
          {
          // eslint-disable-next-line jsx-a11y/media-has-caption
            <video style={{ display: 'none' }} />
          }

          <CenteredContent>
            <Typography variant="h6" textAlign="center">
              Please center you QR code on the screen below
            </Typography>
          </CenteredContent>
          <br />

          <QrReader
            delay={100}
            torch
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
              control={<Switch checked={isTorchOn} onChange={() => setToggleTorch(!isTorchOn)} />}
              label={t('scan.torch')}
            />
          </div>
        </>
      )}
      {
        !isKiosk && (
        <Footer position="5vh" />
        )
      }
    </div>
  );
}


QRScan.defaultProps = {
  isKiosk: false
}
QRScan.propTypes = {
  isKiosk: PropTypes.bool
}
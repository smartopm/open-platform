/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Signature from "react-signature-canvas";
import PropTypes from 'prop-types'
import CenteredContent from '../../../components/CenteredContent';


const useStyles = makeStyles({
  signatureContainer: {
    width: "95%",
    height: "100%",
    margin: "0 auto",
    backgroundColor: "#FFFFFF"
  },
  signaturePad: {
    width: "95%",
    height: "100%"
  }
})

export default function SignaturePad({signRef, onEnd, detail, label}){
    const classes = useStyles()
    return (
      <>
        <div className={classes.signatureContainer}>
          <label className="bmd-label-static" aria-label="sign_title">
            {label}
          </label>
          <Signature
            canvasProps={{ className: classes.signaturePad }}
            ref={signRef}
            onEnd={onEnd}
          />
        </div>
        <br />
        <CenteredContent>
          {detail.status === 'DONE' ? 'Signature saved' : ''}
        </CenteredContent>
      </>
    )
}

SignaturePad.defaultProps = {
  label: 'SIGNATURE'
}

SignaturePad.propTypes = {
    signRef: PropTypes.object.isRequired,
    onEnd: PropTypes.func.isRequired,
    detail: PropTypes.shape({
      status: PropTypes.string,
      type: PropTypes.string
    }).isRequired,
    label: PropTypes.string
}
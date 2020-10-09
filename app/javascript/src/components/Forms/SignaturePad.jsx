/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Signature from "react-signature-canvas";
import PropTypes from 'prop-types'


const useStyles = makeStyles({
  signatureContainer: {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    backgroundColor: "#FFFFFF"
  },
  signaturePad: {
    width: "100%",
    height: "100%"
  }
})

export default function SignaturePad({signRef, props}){
    const classes = useStyles()
    return (
      <div className={classes.signatureContainer}>
        <label className="bmd-label-static">
          SIGNATURE
        </label>
        <Signature
          canvasProps={{ className: classes.signaturePad }}
          ref={signRef}
          {...props}
        />
      </div>
    )
}

SignaturePad.propTypes = {
    signRef: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    props: PropTypes.object.isRequired,
}
  
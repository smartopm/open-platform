/* eslint-disable react/jsx-props-no-multi-spaces */
import React, {useState} from 'react';
import {useMutation} from "react-apollo"
import { Button, TextField , Snackbar, SnackbarContent } from '@material-ui/core'
import PropTypes from 'prop-types'
import CheckCircleIconBase from "@material-ui/icons/CheckCircle";
import { useTranslation } from 'react-i18next';
import { TemperateRecord } from '../graphql/mutations'
import Loading from "../shared/Loading";

export default function CaptureTemp({ refId, refName, refType }) {
    const [recordTemp, { loading: mutationLoading }] = useMutation(TemperateRecord)
    const [open, setOpen] = useState(false)
    const [tempValue, setTempValue] = useState('')
    const [disabled, setDisabled] = useState('')
    const [tempErrorMessage, setTempErrorMessage] = useState('')
    const { t } = useTranslation(['logbook', 'common'])


    function handleClick() {
        if (!tempValue.trim().length) {
            setTempErrorMessage(t('common:errors.empty_input'))
            return
        }
        setTempErrorMessage('')
        recordTemp({
            variables: { refId, temp: tempValue, refName, refType }
        }).then(() => {
            setOpen(!open)
            setTempValue('')
            setDisabled('none')

        })
    }
        return (

          <div className="flex-row col-8 pl-10 " style={{pointerEvents: disabled}}>
            <TextField
              required
              label="°C"
              className="tempvalue"
              variant="outlined"
              value={tempValue}
              size="small"
              style={{ width: 156, marginRight: 30 }}
              InputLabelProps={{
                        shrink: true,
                    }}
              onChange={(event) => setTempValue(event.target.value)}
              error={!!tempErrorMessage}
              helperText={tempErrorMessage}
            />

            <Button className="button" variant="contained" color="inherit" onClick={handleClick}>log</Button>

            <div className="col-2 justify-content-center" />

            {mutationLoading && <Loading />}

            <Snackbar
              className="snackBar"
              anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
              open={open}
              autoHideDuration={6000}
              onClose={() => setOpen(!open)}
            >
              <SnackbarContent
                style={{
                        backgroundColor: '#69ABA4',
                    }}

                message={(
                  <div className="row d-flex m-20"> 
                    {' '}
                    <CheckCircleIconBase /> 
                    {' '}
                    <span className="justify-content-center" id="client-snackbar">{t('logbook:logbook.temperature_recorded')}</span>
                    {' '}
                  </div>
                )}
              />
            </Snackbar>
          </div>
        );

    }

    CaptureTemp.propTypes = {
        refId: PropTypes.string.isRequired,
        refName: PropTypes.string.isRequired,
        refType: PropTypes.string.isRequired
    }

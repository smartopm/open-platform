import React, { Fragment, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import Nav from '../../components/Nav'
import { TextField, MenuItem, Button } from '@material-ui/core'
import { EntryRequestQuery } from '../../graphql/queries.js'
import { AcknowledgeRequest } from '../../graphql/mutations.js'
import Loading from '../../components/Loading'
import { StyleSheet, css } from 'aphrodite'
import DateUtil from '../../utils/dateutil'

export default function RequestConfirm({ match, history }) {
    const { loading, data } = useQuery(EntryRequestQuery, {
        variables: { id: match.params.id },
    })
    const [acknowledgeRequest] = useMutation(AcknowledgeRequest)
    const [isLoading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        nrc: '',
        vehiclePlate: '',
        reason: '',
        loaded: false,
    })

    if (loading) {
        return <Loading />
    }

    // Data is loaded, so set the initialState, but only once
    if (!formData.loaded && data) {
        setFormData({ ...data.result, loaded: true })
    }
    function handleInputChange(e) {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    function handleAcknowledgeRequest() {
        setLoading(true)
        acknowledgeRequest({
            variables: { id: match.params.id }
        })
            .then(() => {
                console.log('acknowledged')
                setLoading(false)
            })
            .catch(() => {
                console.log('an error happened')
                setLoading(false)
            })
    }

    function handleFlagRequest() {
        // This should route to user_show page
        // Maybe pull up a modal with a form to add a flagged note
    }

    return (
        <Fragment>
            <Nav
                navName={'Approve Request'}
                menuButton='cancel'
            />
            <div className='container'>
                <form>

                    <div className='form-group'>
                        <label className='bmd-label-static' htmlFor='date'>
                            Date and time submitted
              </label>
                        <input
                            className='form-control'
                            type='text'
                            value={
                                formData.guard
                                    ? `${new Date(
                                        formData.createdAt
                                    ).toDateString()} at ${DateUtil.dateTimeToString(
                                        new Date(formData.createdAt)
                                    )}`
                                    : ''
                            }
                            disabled={true}
                            name='date'

                        />
                    </div>
                    <div className='form-group'>
                        <label className='bmd-label-static' htmlFor='_name'>
                            Guard
                        </label>
                        <input
                            className='form-control'
                            type='text'
                            value={formData.guard ? formData.guard.name : ''}
                            disabled={true}
                            name='name'

                        />
                    </div>
                    <div className='form-group'>
                        <label className='bmd-label-static' htmlFor='_name'>
                            NAME
            </label>

                        <input
                            className='form-control'
                            type='text'
                            value={formData.name}
                            onChange={handleInputChange}
                            name='name'
                            disabled={true}

                        />
                    </div>
                    <div className='form-group'>
                        <label className='bmd-label-static' htmlFor='nrc'>
                            NRC
                        </label>
                        <input
                            className='form-control'
                            type='text'
                            value={formData.nrc || ''}
                            onChange={handleInputChange}
                            name='nrc'
                            disabled={true}

                        />
                    </div>
                    <div className='form-group'>
                        <label className='bmd-label-static' htmlFor='phoneNumber'>
                            Phone N&#176;
            </label>
                        <input
                            className='form-control'
                            type='text'
                            value={formData.phoneNumber || ''}
                            onChange={handleInputChange}
                            name='phoneNumber'
                            disabled={true}
                        />
                    </div>
                    <div className='form-group'>
                        <label className='bmd-label-static' htmlFor='vehicle'>
                            VEHICLE PLATE N&#176;
            </label>
                        <input
                            className='form-control'
                            type='text'
                            onChange={handleInputChange}
                            value={formData.vehiclePlate || ''}
                            name='vehiclePlate'
                            disabled={true}
                        />
                    </div>
                    <div className='form-group'>
                        <TextField
                            id='reason'
                            select
                            label='Reason for visit'
                            name='reason'
                            value={formData.reason || ''}
                            onChange={handleInputChange}
                            disabled={true}
                            className={`${css(styles.selectInput)}`}>
                            <MenuItem value={formData.reason}>{formData.reason}</MenuItem>
                        </TextField>
                    </div>
                    <div className='row justify-content-center align-items-center'>
                        <div className='col'>
                            <Button
                                variant='contained'
                                onClick={handleAcknowledgeRequest}
                                className={`btn ${css(styles.grantButton)}`}
                                disabled={isLoading}>
                                {isLoading ? 'Loading ...' : 'Acknowledge'}
                            </Button>
                        </div>
                        <div className='col'>
                            <Button
                                variant='contained'
                                onClick={handleFlagRequest}
                                className={`btn  ${css(styles.denyButton)}`}
                                disabled={isLoading}>
                                Flag
              </Button>
                        </div>
                        <div className='col'>
                            <a
                                href={`tel:${formData.guard && formData.guard.phoneNumber}`}
                                className={` ${css(styles.callButton)}`}>
                                Call {formData.guard && formData.guard.name}
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    logButton: {
        backgroundColor: '#25c0b0',
        color: '#FFF',
        width: '75%',
        boxShadow: 'none',
    },
    selectInput: {
        width: '100%',
    },
    grantButton: {
        backgroundColor: '#25c0b0',
        color: '#FFF',
        marginRight: 60,
        // width: "35%"
    },
    denyButton: {
        // backgroundColor: "rgb(230, 63, 69)",
        backgroundColor: 'rgb(38, 38, 38)',
        color: '#FFF',
        // width: "35%"
    },
    callButton: {
        color: 'rgb(230, 63, 69)',
        textTransform: 'unset',
        textDecoration: 'none',
    },
})

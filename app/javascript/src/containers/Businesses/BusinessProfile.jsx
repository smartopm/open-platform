import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import Profile from '../../components/Business/Profile'
import {useParams } from 'react-router-dom'

export default function BusinessProfile() {
    const { id } = useParams() 
    return (
        <div>
            <Fragment>
                <Nav navName="Business Profile" menuButton="back" backTo="/business" />
                <Profile />
            </Fragment>


        </div>
    )
}

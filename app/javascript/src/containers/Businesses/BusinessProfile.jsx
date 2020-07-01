import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import Profile from '../../components/Business/Profile'

export default function BusinessProfile() {
    return (
        <div>
            <Fragment>
                <Nav navName="Business Profile" menuButton="back" backTo="/business" />

                <Profile />
            </Fragment>


        </div>
    )
}

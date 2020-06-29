import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import Business from '../../components/Business/Business'

export default function Businesses() {
    return (
        <div>
            <Fragment>
                <Nav navName="Business" menuButton="back" backTo="/"/>
                <Business />
            </Fragment>


        </div>
    )
}

import React from 'react'
import Nav from '../components/Nav'
import FormLinkList from '../components/FormLinkList'

export default function FormLinks() {
    return (
        <div>
            <Nav navName="Permits and Request Forms" menuButton="back" backTo="/"/>

            <FormLinkList />
            
        </div>
    )
}

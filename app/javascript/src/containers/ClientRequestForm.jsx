import React from 'react'
import { useWindowDimensions } from '../utils/customHooks'
import IframeContainer from '../components/IframeContainer'
import Nav from '../components/Nav';

export default function ClientRequestForm(){
    const { width, height } = useWindowDimensions()
    const url = "https://forms.gle/Sdbj91Sia8EpDJiN6"
    return(

        <React.Fragment>
            <Nav navName="Client Request Form" menuButton="back" backTo="/" />
            <IframeContainer 
                link={url}
                height={height}
                width={width}
            />

        </React.Fragment>

    )

}
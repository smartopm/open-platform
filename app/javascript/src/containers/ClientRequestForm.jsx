import React from 'react'
import { useWindowDimensions } from '../utils/customHooks'
import IframeContainer from '../components/IframeContainer'
import Nav from '../components/Nav';

export default function ClientRequestForm(){
    const { width, height } = useWindowDimensions()
    const url = "https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?embedded=true"
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
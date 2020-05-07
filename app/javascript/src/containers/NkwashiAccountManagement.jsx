import React from 'react';
import { useWindowDimensions } from '../utils/customHooks'
import IframeContainer from '../components/IframeContainer'
import Nav from '../components/Nav';

export default function NkwashiAccountManagement() {
    const { width, height } = useWindowDimensions()
    const url = "https://mythebe.thebe-im.com/index.php/site/login"

    return (

        <React.Fragment>
            <Nav navName="Thebe Investment Management" menuButton="back" backTo="/" />
            <IframeContainer
                link={url}
                height={height}
                width={width}
            />

        </React.Fragment>
    )

}


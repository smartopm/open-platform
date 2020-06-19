import React,{useContext} from 'react'
import Nav from "../components/Nav";
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import CampaignForm from '../components/CampaignForm'

export default function CampaignCreate(){
    const authState = useContext(AuthStateContext)
    return(
        <>
        <Nav navName="Campaign" menuButton="back" backTo="/" />
        <CampaignForm authState={authState}/>
        </>
    )
}
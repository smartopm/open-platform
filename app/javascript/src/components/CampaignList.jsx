import React,{Fragment} from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery } from 'react-apollo'
import { Campaigns } from "../graphql/queries";


export default function CampaignList() {
    
    const {data, error, loading} = useQuery(Campaigns)
    if (loading) return <p>loading</p>
    
    console.log(data.campaigns.map(c => c.name))

    return <div>{data.campaigns.map(c => c.name)}</div>
}

const styles = StyleSheet.create({
    logTitle: {
      color: '#1f2026',
      fontSize: 16,
      fontWeight: 700
    },
    subTitle: {
      color: '#818188',
      fontSize: 14,
      letterSpacing: 0.17,
      fontWeight: 400
    },
    access: {
      color: '#1f2026',
      fontSize: 14,
      letterSpacing: 0.17,
      fontWeight: 400
    }
  })
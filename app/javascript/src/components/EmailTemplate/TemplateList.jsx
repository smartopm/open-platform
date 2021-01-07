// have a list of all templates for the community
import React from 'react'
import { useQuery } from 'react-apollo'
import { EmailTemplatesQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'

export default function TemplateList(){
    const {loading, error, data} = useQuery(EmailTemplatesQuery)
    if(loading) return <Spinner />
    if(error) return error.message
    console.log(data.emailTemplates)
    return 'some list here'
}
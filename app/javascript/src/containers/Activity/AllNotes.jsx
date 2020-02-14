import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import { useQuery } from 'react-apollo'
import { allNotes } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import DateUtil from '../../utils/dateutil.js'
import { formatISO9075 } from 'date-fns'

export default function Notes(params) {
  const { loading, error, data,  } = useQuery(allNotes)
  if (loading) return <Loading />
  if (error) return <ErrorPage error={error.message} />

  return (
        <Fragment>
            <Nav navName='Notes' menuButton='back' /> 

            <div className='container'>
                {
                    Boolean(data.allNotes.length) && (
                        data.allNotes.map(note => (
                            <div key={note.id}>
                            <hr />
                                <p>
                                 <b><a href={`/user/${note.author.id}`}>{note.author.name}</a> </b> created a note for <b><a href={`/user/${note.user.id}`}>{note.user.name}</a></b> on {' '} 
                                    <i style={{ color: 'grey' }}>{ formatISO9075(new Date(note.createdAt))}</i>
                                    <br />
                                    {
                                        note.body
                                    }
                                </p>
                            </div>
                        ))
                    )
                }
            </div>
        </Fragment>
    )
}
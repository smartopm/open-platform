import React from 'react'
import { useQuery } from 'react-apollo';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import { formatError } from '../../../../utils/helpers';
import GuestBook from '../../Components/GuestBook'
import { InvitedGuestsQuery } from '../graphql/queries';


export default function InvitedGuests(){
    const{ data, loading, error } = useQuery(InvitedGuestsQuery, {
        fetchPolicy: "cache-and-network"
    });

    function handleAddObservation(){

    }

    return (
      <>
        { loading && <Spinner /> }
        {
            !error && !loading
            ? (
              <GuestBook
                handleAddObservation={handleAddObservation}
                invitedGuests={data?.invitedGuestList}
              />
          ) : <CenteredContent>{formatError(error?.message)}</CenteredContent>
        }
      </>
    )
}
import React, {useContext} from 'react';
import GuestInviteForm from './GuestInviteForm';
import { Context as AuthStateContext } from "../../../../containers/Provider/AuthStateProvider";

export default function GuestSearch() {
  const authState = useContext(AuthStateContext);
  return (
    <>
      <GuestInviteForm timeZone={authState?.user?.community.timezone} />
    </>
  );
}

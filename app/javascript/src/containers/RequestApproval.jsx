import React from "react";
import RequestStatus from "../components/RequestStatus";

export default function RequestApproval() {
  // isDenied is updated from the request callback from Poniso
  return <RequestStatus isDenied={false} />;
}

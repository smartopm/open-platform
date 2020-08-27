import React from 'react'
import CaptureTemp from '../CaptureTemp'

export default function UserInfo({ data, userType }) {
  return (
    <div className="container">
      <div className="form-group">
        <label className="bmd-label-static" htmlFor="name">
          Name
        </label>
        <input
          className="form-control"
          type="text"
          defaultValue={data.user.name}
          name="name"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="bmd-label-static" htmlFor="Accounts">
          Accounts
        </label>
        <input
          className="form-control"
          type="text"
          defaultValue={data.user.name}
          name="accounts"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="bmd-label-static" htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          className="form-control"
          type="text"
          defaultValue={data.user.phoneNumber}
          name="phoneNumber"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="bmd-label-static" htmlFor="email">
          Email
        </label>
        <input
          className="form-control"
          type="email"
          defaultValue={data.user.email}
          name="email"
          disabled
        />
      </div>
      <br />
      {userType === 'security_guard' && (
        <div className="container row d-flex justify-content-between">
          <span>Social: </span> <br />
          <CaptureTemp
            refId={data.user.id}
            refName={data.user.name}
            refType="User"
          />
        </div>
      )}
    </div>
  )
}

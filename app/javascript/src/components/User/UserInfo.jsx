/* eslint-disable */
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
          aria-label="user_name"
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
          aria-label="user_account"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="bmd-label-static" htmlFor="phoneNumber">
          Primary phone number
        </label>
        <input
          className="form-control"
          type="text"
          defaultValue={data.user.phoneNumber}
          name="phoneNumber"
          aria-label="user_number"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="bmd-label-static" htmlFor="email">
          Primary email address
        </label>
        <input
          className="form-control"
          type="email"
          defaultValue={data.user.email}
          name="email"
          aria-label="user_email"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="bmd-label-static" htmlFor="email">
          Primary address
        </label>
        <input
          className="form-control"
          type="text"
          defaultValue={data.user.address}
          name="address"
          aria-label="address"
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

/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import PropTypes from 'prop-types'
import CaptureTemp from '../CaptureTemp'

// const type = {
//   email: 'Secondary email address',
//   phone: 'Secondary phone number'
// }


export default function UserInfo({ user, userType }) {
  return (
    <div className="container">
      <Contact value={user.name} label="Name" />
      <Contact value={user.name} label="Accounts" />
      <Contact value={user.phoneNumber} label="Phone Number" />
      <Contact value={user.email} label="email" />
      {/* {user.contactInfos?.sort(sortByType).map(contact => (
        <Contact
          key={contact.id}
          value={contact.info}
          label={type[contact.contactType]}
        />
      ))} */}
      <br />
      <span>Social: </span>
      <br />
      {userType === 'security_guard' && (
        <div className="container row d-flex justify-content-between">
          <CaptureTemp refId={user.id} refName={user.name} refType="User" />
        </div>
      )}
    </div>
  )
}

export function Contact({ value, label }) {
  return (
    <div className="form-group">
      <label className="bmd-label-static">{label}</label>
      <input
        className="form-control"
        type="text"
        defaultValue={value}
        name="email"
        aria-label="label"
        disabled
      />
    </div>
  )
}

UserInfo.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
    id: PropTypes.string,
    contactInfos: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.string,
        contactType: PropTypes.string,
        id: PropTypes.string
      })
    )
  }).isRequired,
  userType: PropTypes.string.isRequired
}

Contact.defaultProps = {
  value: ''
}
Contact.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired
}

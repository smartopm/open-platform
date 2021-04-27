/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import PropTypes from 'prop-types'
import CaptureTemp from '../CaptureTemp'

const type = {
  email: 'Secondary email address',
  phone: 'Secondary phone number',
  address: 'Secondary Address'
}

// list contactInfo by contactType in reverse order
export function sortByType(prev, next){
  if (prev.contactType < next.contactType) {
    return 1;
  }
  if (prev.contactType > next.contactType) {
    return -1;
  }
  return 0
}
export default function UserInfo({ user, userType }) {
  return (
    <div className="container">
      <Contact value={user.name} label="Name" />
      <Contact value={user.name} label="Accounts" />
      <Contact value={user.phoneNumber} label="Primary phone number" />
      <Contact value={user.email} label="Primary email" />

      {user.contactInfos?.sort(sortByType).map(contact => (
        <Contact
          key={contact.id}
          value={contact.info}
          label={type[contact.contactType]}
        />
        ))}
      <br />
      <Contact value={user.address} label="Primary Address" />
      <span>Social: </span>
      <br />
      {userType === 'security_guard' && (
        <div className="container row d-flex justify-content-between">
          <CaptureTemp refId={user.id} refName={user.name} refType="Users::User" />
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
        aria-label={label}
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
    address: PropTypes.string,
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

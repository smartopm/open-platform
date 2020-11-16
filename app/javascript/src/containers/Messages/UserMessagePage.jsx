import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import UserMessages from '../../components/Messaging/UserMessages'
import Nav from '../../components/Nav'

export default function UserMessagePage() {
  const { id } = useParams()
  const { state } = useLocation()
  return (
    <>
      <Nav navName="Messages History" menuButton="back" backTo="/messages">
        <span className="text-center">
          <Link
            to={`/user/${id}`}
            style={{
              textDecoration: 'none',
              color: '#FFFFFF'
            }}
          >
            {(state && state.clientName) || ''}
          </Link>
        </span>
      </Nav>
      <UserMessages />
    </>
  )
}

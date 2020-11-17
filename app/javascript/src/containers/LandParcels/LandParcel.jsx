import React from 'react'
import Nav from '../../components/Nav'
import LandParcel from '../../components/LandParcels/LandParcel'

export default function LandParcelPage() {
  return (
    <div>
      <Nav navName="Parcels and Properties" menuButton="back" backTo="/" />
      <LandParcel />
    </div>
  )
}
import React from 'react';
import Nav from '../../components/Nav';
import UserStats from '../../components/User/UserStats';

export default function StatsPage() {
  return (
    <>
      <Nav navName="User Stats" backTo="/users" menuButton="back" />
      <UserStats />
    </>
  );
}

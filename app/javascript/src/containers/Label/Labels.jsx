import React, { useContext } from 'react';
import LabelList from '../../components/Label/LabelList';
import { Context as AuthStateContext } from '../Provider/AuthStateProvider';

export default function Labels() {
  const authState = useContext(AuthStateContext);
  return <LabelList userType={authState?.user?.userType} />;
}

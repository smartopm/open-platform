// This should export all components to be used on the stepper
import React from 'react';
import GuestForm from './GuestForm';

export default function steps(handleNext) {
  return [
    {
      title: 'Guest Form',
      component: <GuestForm handleNext={handleNext} />,
    },
  ];
}

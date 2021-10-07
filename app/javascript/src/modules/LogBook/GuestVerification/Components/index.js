// This should export all components to be used on the stepper
import React from 'react';
import GuestForm from './GuestForm';
import IDCapture from './IdCapture';

export default function steps(handleNext) {
  return [
    {
      title: 'Guest Form',
      component: <GuestForm handleNext={handleNext} />,
    },
    {
      title: 'ID',
      component: <IDCapture handleNext={handleNext} />,
    },
    {
      title: 'Face',
      component: <p>Some other weird component</p>,
    },
    {
      title: 'Wild',
      component: <p>Some other weird component</p>,
    },
  ];
}

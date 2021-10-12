// This should export all components to be used on the stepper
// If there is only one step, it won't show the stepper
import React from 'react';
import GuestForm from './GuestForm';
// import VideoCapture from './VideoCapture';

export default function steps(handleNext) {
  return [
    {
      title: 'Guest Form',
      component: <GuestForm handleNext={handleNext} />,
    },
    // {
    //   title: 'Capture Video',
    //   component: <VideoCapture handleNext={handleNext} />,
    // },
  ];
}

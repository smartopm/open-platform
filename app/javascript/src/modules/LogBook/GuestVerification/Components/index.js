// This should export all components to be used on the stepper
// If there is only one step, it won't show the stepper
import React from 'react';
import GuestForm from './GuestForm';
import VideoCapture from './VideoCapture';
import IdCapture from './IdCapture';

export default function steps(handleNext, communityName) {
  const verificationSteps = [
    {
      title: 'Guest Form',
      component: <GuestForm handleNext={handleNext} />
    },
    {
      title: 'Id Capture',
      component: <IdCapture handleNext={handleNext} />
    },
    {
      title: 'Capture Video',
      component: <VideoCapture handleNext={handleNext} />
    }
  ];
  // hardcoding this for now before we make this a community setting
  if (communityName !== 'Nkwashi') {
    return verificationSteps.slice(0, 1);
  }
  return verificationSteps;
}

import React from 'react';
import { Redirect, useParams } from 'react-router-dom'

export default function TaskPageRedirect(){
  const { taskId } = useParams();
  return  <Redirect push to={`/tasks?taskId=${taskId}`} />
}

import React from 'react';
import { useLocation, useParams } from 'react-router';
import ProcessCreate from './ProcessCreate';

export default function ProcessBuilderPage() {
  const path = useLocation();
  const { processId } = useParams();

  return(
    <div>
        <ProcessCreate />
    </div>
  )
}

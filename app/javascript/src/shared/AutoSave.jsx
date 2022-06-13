/* istanbul ignore next */
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

 /* istanbul ignore next */
export default function AutoSave({ data, autoSaveAction, delay, previous}) {
  const wait = delay || 1000;
  
  /* istanbul ignore next */
  const memoisedAction = useCallback((value) => {
    const handler = setTimeout(() => {
      autoSaveAction(value);
    }, wait);

    return () => {
      clearTimeout(handler);
    };
  },[])

  /* istanbul ignore next */
  useEffect(() => {
    if(data && data !== previous) {
      memoisedAction(data)
    }
  }, [data])

  return null;
}

AutoSave.defaultProps = {
  delay: null,
}

AutoSave.propTypes = {
  data: PropTypes.string.isRequired,
  previous: PropTypes.string.isRequired,
  delay: PropTypes.number,
  autoSaveAction: PropTypes.func.isRequired,
};

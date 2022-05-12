import React from 'react';
import PropTypes from 'prop-types';

export default function Label({ color, title, borderRadius, width, groupingName }) {
  return (
      (!groupingName) ? (
        <p
          style={{
         textAlign: 'center',
         background: color,
         padding: '9px',
         color: 'white',
         borderRadius,
         fontSize: '12px',
         width
        }}
          className='custom-label'
        >
          {title}
        </p>
      ) : (
        <span>
          <span>
            {groupingName}
          </span>
          <span>
            {title}
          </span>
        </span>
      )
  );
}

Label.defaultProps = {
  borderRadius: '16px',
  width: '100%',
  groupingName: '',
}

Label.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  borderRadius: PropTypes.string,
  width: PropTypes.string,
  groupingName: PropTypes.string
};

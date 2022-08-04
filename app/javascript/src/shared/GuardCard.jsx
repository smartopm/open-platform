import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

export default function GuardCard({ path, icon, title, name }) {
  const classes = useStyles();

  return (
    <div className={`${classes.cardSize} card align-self-center text-center`}>
      {name === 'call-manager' ? (
        <a href={path}>
          <div className="card-body">
            <h5 className="card-title">{icon}</h5>
            {title}
          </div>
        </a>
      ) : (
        <Link to={path} className="card-link">
          <div className="card-body">
            <h5 className="card-title">{icon}</h5>
            <p>{title}</p>
          </div>
        </Link>
      )}
    </div>
  );
}

GuardCard.propTypes = {
  icon: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const useStyles = makeStyles(() => ({
  cardSize: {
    width: 200,
    height: 154,
  },
}));

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';
import { Context as ThemeContext } from '../../Themes/Nkwashi/ThemeProvider';

export default function Card({
  title,
  path,
  icon,
  from,
  clientName,
  clientNumber,
  children,
  id,
  access,
  authState
}) {
  const theme = useContext(ThemeContext);
  if (
    !access.includes(authState.user.userType.toLowerCase()) ||
    (id === 10 && authState.user.community.name !== 'Nkwashi') ||
    (id === 14 && authState.user.community.name === 'Ciudad Morazán')
  ) {
    return null;
  }

  return (
    <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
      <span>{children}</span>
      <Link
        to={{
          pathname: path,
          state: {
            clientName,
            clientNumber,
            from
          }
        }}
        id={id}
        className="card-link"
      >
        <div className="card-body">
          <h5 className="card-title">
            <span style={{ color: theme.primaryColor }}>{icon}</span>
          </h5>
          <p className={css(styles.CardtextIcon)}>{title}</p>
        </div>
      </Link>
    </div>
  );
}

export function SVGIcon({ image, alt }) {
  return <img src={image} alt={alt} />;
}

SVGIcon.propTypes = {
  image: PropTypes.node.isRequired,
  alt: PropTypes.string.isRequired
}

Card.defaultProps = {
  children: <div />,
  from: '',
  clientName: '',
  clientNumber: '',
  id: '',
  icon: <div />,
  title: '',
  path: null
};

Card.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node,
  title: PropTypes.string,
  path: PropTypes.string,
  from: PropTypes.string,
  clientName: PropTypes.string,
  clientNumber: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  access: PropTypes.arrayOf(PropTypes.string).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  CardtextIcon: {
    marginTop: '15.5%'
  },
  CardtextImg: {
    marginTop: '21%'
  },
  cardSize: {
    width: 200,
    height: 154
  }
});

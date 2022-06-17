import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
// import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import IconButton from '@mui/material/IconButton';

export default function UserLabelTitle({ isLabelOpen, setIsLabelOpen }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:900px)');
  const { t } = useTranslation(['common', 'label']);
  return matches ? (
    <IconButton color='primary' onClick={() => setIsLabelOpen(!isLabelOpen)}>
      <LocalOfferIcon />
    </IconButton>
  ) : (
    <ButtonGroup color="primary" aria-label="outlined select button" data-testid="button">
      <Button>{t('label:label.labels')}</Button>
      <Button
        onClick={() => setIsLabelOpen(!isLabelOpen)}
        data-testid="select_icon"
        className="label_select"
      >
        {isLabelOpen ? (
          <KeyboardArrowUpIcon className={classes.linkIcon} data-testid="labels_open_icon" />
        ) : (
          <KeyboardArrowDownIcon className={classes.linkIcon} data-testid="labels_closed_icon" />
        )}
      </Button>
    </ButtonGroup>
  );
  // <Typography
  //   variant="subtitle1"
  //   className={classes.wrapIcon}
  //   onClick={() => setIsLabelOpen(!isLabelOpen)}
  //   data-testid="label_toggler"
  // >
  //   {t('label:label.labels')}
  //   {' '}
  //   {'  '}
  //   {isLabelOpen ? (
  //     <KeyboardArrowUpIcon className={classes.linkIcon} data-testid="labels_open_icon" />
  //     ) : (
  //       <KeyboardArrowDownIcon className={classes.linkIcon} data-testid="labels_closed_icon" />
  //     )}
  // </Typography>
}

const useStyles = makeStyles(() => ({
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    cursor: 'pointer'
  },
  linkIcon: {
    marginTop: 3,
    marginLeft: 6
  }
}));

UserLabelTitle.propTypes = {
  setIsLabelOpen: PropTypes.func.isRequired,
  isLabelOpen: PropTypes.bool.isRequired
};

import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import IconButton from '@mui/material/IconButton';

export default function UserLabelTitle({ isLabelOpen, setIsLabelOpen }) {
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
        data-testid="label_toggler"
        className="label_select"
      >
        {isLabelOpen ? (
          <KeyboardArrowUpIcon data-testid="labels_open_icon" />
        ) : (
          <KeyboardArrowDownIcon data-testid="labels_closed_icon" />
        )}
      </Button>
    </ButtonGroup>
  );
}

UserLabelTitle.propTypes = {
  setIsLabelOpen: PropTypes.func.isRequired,
  isLabelOpen: PropTypes.bool.isRequired
};

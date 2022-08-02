import { Box, Typography, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import PropTypes from 'prop-types';
import { objectAccessor } from '../utils/helpers';

/**
 * @param {object} checks - List of rules and definitions that should be matched
 * 
 */
export default function PasswordCheck({ checks }) {
  const { rules, definitions } = checks;

  return rules.map(rule => {
    const { message, valid } = objectAccessor(definitions, rule);
    return (
      <Stack direction="row" alignItems="center" gap={1} key={rule}>
        {valid ? <CheckIcon /> : <CloseIcon />}
        <Typography>
          <Box sx={{ color: valid ? 'primary.main' : 'error.main' }}>{message}</Box>
        </Typography>
      </Stack>
    );
  });
}

PasswordCheck.propTypes = {
  checks: PropTypes.shape({
    rules: PropTypes.arrayOf(PropTypes.string).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    definitions: PropTypes.object.isRequired,
  }),
};

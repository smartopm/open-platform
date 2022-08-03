import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import { IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CenteredContent from './CenteredContent';
import MenuList from './MenuList';

export default function CardWrapper({
  children,
  title,
  buttonName,
  displayButton,
  handleButton,
  menuItems,
  cardStyles,
  hasAccessToMenu
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElOpen = Boolean(anchorEl);

  const menuData = {
    menuItems,
    anchorEl,
    handleClick: event => setAnchorEl(event.currentTarget),
    open: anchorElOpen,
    handleClose: () => setAnchorEl(null)
  };

  return (
    <div className={classes.container} style={{ ...cardStyles }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: `${menuItems?.length > 0 ? '12px' : '20px'}`
        }}
      >
        <Typography variant="h6" color="text.secondary" data-testid="card-title">
          {title}
        </Typography>
        {menuItems?.length > 0 && hasAccessToMenu &&(
          <>
            <IconButton
              aria-controls="long-menu"
              aria-haspopup="true"
              data-testid="discussion-menu"
              onClick={event => menuData.handleClick(event)}
              color="primary"
            >
              <MoreVertIcon />
            </IconButton>
            <MenuList
              open={menuData.open}
              anchorEl={menuData.anchorEl}
              handleClose={menuData.handleClose}
              list={menuData.menuItems}
            />
          </>
        )}
      </Box>

      {children}
      {displayButton && (
        <CenteredContent>
          <div style={{ marginTop: '20px' }}>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={handleButton}
              data-testid="button"
              style={{ background: '#FFFFFF' }}
            >
              {buttonName}
            </Button>
          </div>
        </CenteredContent>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: '10px 10px 24px 10px',
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: '10px',
    background: '#FBFBFA'
  }
}));

CardWrapper.defaultProps = {
  title: '',
  buttonName: '',
  menuItems: [],
  cardStyles: {},
  hasAccessToMenu: true
};

CardWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  buttonName: PropTypes.string,
  displayButton: PropTypes.bool.isRequired,
  handleButton: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  cardStyles: PropTypes.object,
  menuItems: PropTypes.arrayOf(PropTypes.object),
  hasAccessToMenu: PropTypes.bool
};

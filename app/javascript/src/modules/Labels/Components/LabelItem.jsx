import React, { useState } from 'react';
import { IconButton, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { MoreHorizOutlined } from '@mui/icons-material';
import LabelActionMenu from './LabelActionMenu';
import Label from '../../../shared/label/Label';
import DataList from '../../../shared/list/DataList';
import Text from '../../../shared/Text';

export default function LabelItem({ label, userType, refetch }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation('common');
  const anchorElOpen = Boolean(anchorEl);
  const classes = useStyles();
  const labelsHeader = [
    {
      title: 'Labels',
      value: t('table_headers.labels'),
      col: 2
    },
    { title: 'No of Users', value: t('table_headers.labels_total_no_of_users'), col: 2 },
    {
      title: 'Description',
      value: t('table_headers.labels_description'),
      col: 2
    },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
  ];

  const menuData = {
    handleClick: event => setAnchorEl(event.currentTarget),
    anchorEl,
    open: anchorElOpen,
    handleClose: () => setAnchorEl(null),
    refetch
  };
  return (
    <>
      <div className={classes.planList}>
        <DataList
          keys={labelsHeader}
          data={renderLabels(label, menuData, userType)}
          hasHeader={false}
        />
      </div>
    </>
  );
}

export function renderLabels(label, menuData, userType) {
  return [
    {
      Labels: (
        <Grid item xs={12} md={2} data-testid="short_desc">
          <Label
            color={label.color}
            title={label.shortDesc}
            groupingName={label.groupingName}
          />
        </Grid>
      ),
      'No of Users': (
        <Grid item xs={12} md={2} data-testid="user_count">
          <Text content={label.userCount} />
        </Grid>
      ),
      Description: (
        <Grid item xs={12} md={2} data-testid="description">
          <Text content={label.description} />
        </Grid>
      ),
      Menu: (
        <Grid item xs={12} md={1} data-testid="menu">
          {userType === 'admin' && (
            <>
              <IconButton
                aria-controls="sub-menu"
                aria-haspopup="true"
                data-testid="label-menu"
                dataid={label.id}
                onClick={event => menuData.handleClick(event)}
                size="large"
              >
                <MoreHorizOutlined />
              </IconButton>
              <LabelActionMenu
                data={label}
                anchorEl={menuData.anchorEl}
                handleClose={menuData.handleClose}
                open={menuData.open && menuData?.anchorEl?.getAttribute('dataid') === label.id}
                refetch={menuData.refetch}
              />
            </>
          )}
        </Grid>
      )
    }
  ];
}

LabelItem.propTypes = {
  label: PropTypes.shape({
    id: PropTypes.string,
    shortDesc: PropTypes.string,
    color: PropTypes.string,
    description: PropTypes.string,
    userCount: PropTypes.number
  }).isRequired,
  userType: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired
};

const useStyles = makeStyles(() => ({
  labelItem: {
    borderBottomStyle: 'solid',
    borderBottomColor: '#F6F6F6',
    borderBottom: 10,
    backgroundColor: '#FFFFFF'
  },
  labelGrid: {
    marginTop: '8px'
  },
  menuButton: {
    float: 'right'
  }
}));

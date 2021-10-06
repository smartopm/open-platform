import React, { useState } from 'react';
import { IconButton, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { MoreHorizOutlined } from '@material-ui/icons';
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
    handleClick: (event) => setAnchorEl(event.currentTarget),
    anchorEl,
    open: anchorElOpen,
    handleClose: () => setAnchorEl(null),
    refetch,
    userType
  };
  return (
    <>
      <div className={classes.planList}>
        <DataList keys={labelsHeader} data={renderLabels(label, menuData)} hasHeader={false} />
      </div>
    </>
  );
}

export function renderLabels(label, menuData) {
  return [
    {
      Labels: (
        <Grid item xs={12} md={2} data-testid="plan_type">
          <Label color={label.color} title={label.shortDesc} />
        </Grid>
      ),
      'No of Users': (
        <Grid item xs={12} md={2} data-testid="start_date">
          <Text content={label.userCount} />
        </Grid>
      ),
      Description: (
        <Grid item xs={12} md={2} data-testid="end_date">
          <Text content={label.description} />
        </Grid>
      ),
      Menu: (
        <Grid item xs={12} md={1} data-testid="menu">
          {menuData.userType === 'admin' && (
            <>
              <IconButton
                aria-controls="sub-menu"
                aria-haspopup="true"
                data-testid="label-menu"
                dataid={label.id}
                onClick={event => menuData.handleClick(event)}
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

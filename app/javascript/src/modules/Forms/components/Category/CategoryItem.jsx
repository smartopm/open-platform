import React, { useContext, useState } from 'react';
import { Container, Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import { Spinner } from '../../../../shared/Loading';
import { checkCondition, extractValidFormPropertyValue } from '../../utils';
import { FormContext } from '../../Context';
import MenuList from '../../../../shared/MenuList';

export default function CategoryItem({
  category,
  handleAddField,
  handleEditCategory,
  handleDeleteCategory,
  children,
  collapsed,
  editMode,
  loading,
  currentId
}) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:900px)');
  const { formProperties } = useContext(FormContext);
  const properties = extractValidFormPropertyValue(formProperties);
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation(['form', 'common']);
  const anchorElOpen = Boolean(anchorEl);
  const menuList = [
    {
      content: t('common:menu.edit'),
      isAdmin: true,
      color: '',
      handleClick: e => {
        handleEditCategory();
        handleClose(e);
      }
    },
    {
      content: t('common:menu.delete'),
      isAdmin: true,
      color: '',
      handleClick: e => {
        handleDeleteCategory();
        handleClose(e);
      }
    }
  ];

  function handleMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  const menuData = {
    menuList,
    handleMenu,
    anchorEl,
    open: anchorElOpen,
    handleClose
  };

  if (!checkCondition(category, properties, editMode)) {
    return null;
  }
  return (
    <>
      {(!editMode && !category.headerVisible) ? null : (
        <Grid style={!editMode && !matches ? { padding: '0 100px' } : {}}>
          <Grid container className={classes.categorySection}>
            <Grid item xs={8} sm={10}>
              <Typography className={classes.categoryName}>{category.fieldName}</Typography>
            </Grid>
            <Grid item xs={2} sm={1} className={classes.align}>
              {editMode && (
                <IconButton
                  aria-label="add questions to this category"
                  onClick={handleAddField}
                  className="form-category-add-field-btn"
                  size="large"
                  data-testid='add_property'
                >
                  {collapsed ? (
                    <Tooltip title={t('actions.hide')}>
                      <CloseIcon color="primary" />
                    </Tooltip>
                  ) : (
                    <Tooltip title={t('actions.add_property')}>
                      <AddCircleOutlineIcon color="primary" data-testid="add-icon" />
                    </Tooltip>
                  )}
                </IconButton>
              )}
            </Grid>
            <Grid item xs={2} sm={1} className={classes.align}>
              {editMode && (
                <>
                  {loading && currentId === category.id ? (
                    <Spinner />
                  ) : (
                    <>
                      <IconButton
                        aria-label="edit this category"
                        size="large"
                        onClick={event => menuData.handleMenu(event)}
                        data-testid='category_option'
                      >
                        <MoreVertIcon color="primary" />
                      </IconButton>
                      <MenuList
                        open={menuData.open}
                        anchorEl={menuData.anchorEl}
                        handleClose={menuData.handleClose}
                        list={menuData.menuList}
                      />
                    </>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
      <Container>{children}</Container>
    </>
  );
}

CategoryItem.defaultProps = {
  handleAddField: () => {},
  handleEditCategory: () => {},
  handleDeleteCategory: () => {},
  collapsed: undefined,
  loading: undefined,
  currentId: undefined
}

CategoryItem.propTypes = {
  category: PropTypes.shape({
    fieldName: PropTypes.string,
    headerVisible: PropTypes.bool,
    id: PropTypes.string
  }).isRequired,
  handleAddField: PropTypes.func,
  handleEditCategory: PropTypes.func,
  handleDeleteCategory: PropTypes.func,
  children: PropTypes.node.isRequired,
  collapsed: PropTypes.bool,
  editMode: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  currentId: PropTypes.string
};

const useStyles = makeStyles({
  categorySection: {
    background: '#FAFAFA',
    borderRadius: 5,
    marginTop: 22
  },
  categoryName: {
    padding: 13
  },
  align: {
    textAlign: 'right'
  }
});

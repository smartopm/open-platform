import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useMutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import BusinessDeleteDialogue from '../../../shared/dialogs/DeleteDialogue';
import { DeleteBusiness } from '../graphql/business_mutations';
import { canDeleteBusiness, canUpdateBusiness } from '../utils';

export default function BusinessActionMenu({
  data,
  anchorEl,
  handleClose,
  authState,
  open,
  linkStyles,
  refetch,
  handleEditClick
}) {
  const [openModal, setOpenModal] = useState(false);
  const [deleteBusiness] = useMutation(DeleteBusiness);
  const { t } = useTranslation('common')

  function handleDeleteClick() {
    setOpenModal(!openModal);
  }
  function handleDelete() {
    deleteBusiness({
      variables: { id: data.id }
    }).then(() => {
      handleClose();
      refetch();
    });
  }
  return (
    <Menu
      id={`long-menu-${data.id}`}
      anchorEl={anchorEl}
      open={open}
      keepMounted
      onClose={handleClose}
      PaperProps={{
        style: {
          width: 200
        }
      }}
    >
      <div>
        {canDeleteBusiness(authState) && (
        <MenuItem
          id="delete_button"
          key="delete_user"
          onClick={() => handleDeleteClick()}
          data-testid="delete_button"
        >
          {t('menu.delete')}
        </MenuItem>
          )}
        {canUpdateBusiness(authState) && (
        <MenuItem
          id="edit_button"
          data-testid="edit_button"
          onClick={() => handleEditClick()}
        >
          {t('menu.edit')}
        </MenuItem>
          )}
        <MenuItem>
          <Link
            to={`/business/${data.id}`}
            className={linkStyles}
          >
            {t('menu.view_details')}
          </Link>
        </MenuItem>

        <BusinessDeleteDialogue
          open={openModal}
          handleClose={handleDeleteClick}
          handleAction={handleDelete}
          title="business"
          action={t('menu.delete')}
        />
      </div>
    </Menu>
  );
}

BusinessActionMenu.defaultProps = {
  data: {},
  authState: {},
  linkStyles: '',
  anchorEl: {},
};

BusinessActionMenu.propTypes = {
  refetch: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.instanceOf(Object),
  authState: PropTypes.instanceOf(Object),
  open: PropTypes.bool.isRequired,
  linkStyles: PropTypes.string,
  handleEditClick: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Object),
};

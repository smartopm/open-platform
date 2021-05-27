/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useMutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BusinessDeleteDialogue from '../../../shared/dialogs/DeleteDialogue';
import { DeleteBusiness } from '../graphql/business_mutations';

export default function BusinessActionMenu({
  data,
  anchorEl,
  handleClose,
  userType,
  open,
  linkStyles,
  refetch
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
        {userType === 'admin' && (
          <>
            <MenuItem
              id="delete_button"
              key="delete_user"
              onClick={() => handleDeleteClick()}
              data-testid="delete_button"
            >
              {t('menu.delete')}
            </MenuItem>
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
          </>
        )}
      </div>
    </Menu>
  );
}

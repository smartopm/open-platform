// Progressively Simplify the RenderForm
import { Grid, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import ListWrapper from '../../../../shared/ListWrapper';
import FormPropertyAction from '../FormPropertyAction';

export default function FormPropertyWrapper({
  formPropertiesData,
  propertyActionData,
  editMode,
  children,
  number,
}) {
  return (
    <Grid container key={formPropertiesData.id} alignItems="center" justifyContent="center">
      {editMode && (
        <Grid item xs={1}>
          <Typography color="textSecondary">{number}</Typography>
        </Grid>
      )}
      <Grid item xs={editMode ? 10 : 12} style={{ margin: '10px 0' }}>
        <ListWrapper>{children}</ListWrapper>
      </Grid>
      {editMode && (
        <Grid item xs={1}>
          <FormPropertyAction
            formId={propertyActionData.formId}
            editMode={editMode}
            propertyId={formPropertiesData.id}
            refetch={propertyActionData.refetch}
            categoryId={propertyActionData.categoryId}
            formDetailRefetch={propertyActionData.formDetailRefetch}
          />
        </Grid>
      )}
    </Grid>
  );
}

FormPropertyWrapper.propTypes = {
  formPropertiesData: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  propertyActionData: PropTypes.shape({
    formId: PropTypes.string,
    refetch: PropTypes.func,
    formDetailRefetch: PropTypes.func,
    categoryId: PropTypes.string,
  }).isRequired,
  editMode: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  number: PropTypes.number.isRequired,
};

import React, { Fragment, useState } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
  Box,
  Grid,
  IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useMutation, useQuery } from 'react-apollo';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import FormLinks, { useStyles } from './FormLinks';
import { FormsQuery } from '../graphql/forms_queries';
import { Spinner } from '../../../shared/Loading';
import { formatError } from '../../../utils/helpers';
import { FormCreateMutation } from '../graphql/forms_mutation';
import FloatButton from '../../../components/FloatButton';
import FormCreate from './FormCreate';
import FormHeader from '../../../shared/PageHeader';
import FormMenu from './FormMenu';
import CenteredContent from '../../../shared/CenteredContent';
import PageWrapper from '../../../shared/PageWrapper';
import AccessCheck from '../../Permissions/Components/AccessCheck';

// here we get existing google forms and we mix them with our own created forms
export default function FormLinkList({ userType, community, path, id, t }) {
  const { data, error, loading, refetch } = useQuery(FormsQuery, {
    fetchPolicy: 'cache-and-network'
  });

  const [createForm] = useMutation(FormCreateMutation);
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [formId, setFormId] = useState('');
  const menuOpen = Boolean(anchorEl);

  function handleOpenMenu(event, Id) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setFormId(Id);
  }

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  return (
    <div>
      {(path === '/forms/create' || id) && (
        <>
          <FormHeader
            linkText={t('common:misc.forms')}
            linkHref="/forms"
            pageName={t('misc.create_form')}
            PageTitle={t('misc.create_form')}
          />
          <PageWrapper>
            <FormCreate
              formMutation={createForm}
              refetch={refetch}
              actionType={id ? 'update' : undefined}
              formId={id}
              t={t}
            />
          </PageWrapper>
        </>
      )}
      {path === '/forms' && (
        <>
          <List data-testid="forms-link-holder" style={{ cursor: 'pointer' }}>
            <FormLinks community={community} t={t} />
            {data.forms.length ? (
              data.forms.map(form => (
                <Fragment key={form.id}>
                  <ListItem
                    key={form.id}
                    data-testid="community_form"
                    onClick={() => history.push(`/form/${form.id}/${form.name}/entries`)}
                  >
                    <Grid container spacing={1} style={{ marginTop: '8px' }}>
                      <Grid item xs={1}>
                        <ListItemAvatar data-testid="community_form_icon">
                          <Avatar>
                            <AssignmentIcon />
                          </Avatar>
                        </ListItemAvatar>
                      </Grid>
                      <Grid item xs={9}>
                        <Box className={classes.listBox}>
                          <Typography variant="subtitle1" data-testid="form_name">
                            {form.name}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        {userType === 'admin' && (
                          <IconButton
                            className={`${css(styles.menuButton)} form-menu-open-btn`}
                            aria-label={`more-${form.name}`}
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={event => handleOpenMenu(event, form.id)}
                            dataid={form.id}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </ListItem>
                  {formId === form.id && (
                    <FormMenu
                      formId={formId}
                      formName={form.name}
                      anchorEl={anchorEl}
                      handleClose={() => setAnchorEl(null)}
                      open={menuOpen}
                      refetch={refetch}
                      t={t}
                    />
                  )}
                  <Divider variant="middle" />
                </Fragment>
              ))
            ) : (
              <CenteredContent>
                <Typography data-testid="no-form-available">{t('common:misc.no_forms')}</Typography>
              </CenteredContent>
            )}
          </List>
          <AccessCheck module="forms" allowedPermissions={['can_create_form']}>
            <FloatButton
              title={t('actions.create_a_form')}
              handleClick={() => history.push('/forms/create')}
              otherClassNames="new-permit-request-form-btn"
            />
          </AccessCheck>
        </>
      )}
    </div>
  );
}

FormLinkList.defaultProps = {
  id: null
};

FormLinkList.propTypes = {
  userType: PropTypes.string.isRequired,
  community: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  id: PropTypes.string,
  t: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  menuButton: {
    float: 'right'
  }
});

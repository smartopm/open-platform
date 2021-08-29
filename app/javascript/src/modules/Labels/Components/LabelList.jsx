import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { Grid, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LabelsQuery } from '../../../graphql/queries';
import ErrorPage from '../../../components/Error';
import Loading from '../../../shared/Loading';
import LabelItem from './LabelItem';
import CenteredContent from '../../../components/CenteredContent';
import Paginate from '../../../components/Paginate';
import ButtonComponent from '../../../shared/buttons/Button';
import EditModal from './EditModal';

export default function LabelList({ userType }) {
  const classes = useStyles();
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('label');
  const { data, error, loading, refetch } = useQuery(LabelsQuery, {
    variables: { limit, offset }
  });

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  if (loading) return <Loading />;
  if (error) {
    return <ErrorPage title={error.message} />;
  }
  return (
    <Container>
      <div className={classes.labelButton}>
        <ButtonComponent
          variant='contained'
          color="primary"
          buttonText={t('label.create_label')}
          handleClick={() => setOpen(true)}
          size="large"
        />
        <EditModal
          open={open}
          handleClose={() => setOpen(false)}
          refetch={refetch}
          data={data}
          type='new'
        />
      </div>
      <LabelPageTitle />
      <br />
      {data?.labels.map(label => (
        <LabelItem
          key={label.id}
          label={label}
          userType={userType}
          userCount={label.userCount}
          refetch={refetch}
        />
      ))}
      <CenteredContent>
        <Paginate offSet={offset} limit={limit} active={offset >= 1} handlePageChange={paginate} />
      </CenteredContent>
    </Container>
  );
}

function LabelPageTitle() {
  const classes = useStyles();
  const { t } = useTranslation('common');

  return (
    <Grid container spacing={6} className={classes.labelTitle}>
      <Grid item xs={3}>
        <Typography variant="subtitle2" data-testid="label-name" className={classes.label}>
          {t('table_headers.labels')}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle2" data-testid="label-name">
          {t('table_headers.labels_total_no_of_users')}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle2" data-testid="label-name">
          {t('table_headers.labels_description')}
        </Typography>
      </Grid>
    </Grid>
  );
}

LabelList.propTypes = {
  userType: PropTypes.string.isRequired
};
const useStyles = makeStyles(() => ({
  labelTitle: {
    marginTop: '5%'
  },
  label: {
    marginLeft: 20
  },
  labelButton: {
    textAlign: 'right'
  }
}));

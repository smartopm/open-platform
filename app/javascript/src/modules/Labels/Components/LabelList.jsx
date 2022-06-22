import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LabelsQuery } from '../../../graphql/queries';
import LabelItem from './LabelItem';
import CenteredContent from '../../../shared/CenteredContent';
import Paginate from '../../../components/Paginate';
import ButtonComponent from '../../../shared/buttons/Button';
import EditModal from './EditModal';
import ListHeader from '../../../shared/list/ListHeader';
import { Spinner } from '../../../shared/Loading';
import { formatError } from '../../../utils/helpers';
import PageWrapper from '../../../shared/PageWrapper';

export default function LabelList({ userType }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['label', 'common']);
  const { data, error, loading, refetch } = useQuery(LabelsQuery, {
    variables: { limit, offset }
  });

  const labelsHeader = [
    {
      title: 'Labels',
      value: t('common:table_headers.labels'),
      col: 2
    },
    { title: 'No of Users', value: t('common:table_headers.labels_total_no_of_users'), col: 2 },
    {
      title: 'Description',
      value: t('common:table_headers.labels_description'),
      col: 2
    },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
  ];

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  return (
    <PageWrapper pageTitle={t('common:table_headers.labels')}>
      <div className={classes.labelButton}>
        <ButtonComponent
          variant="contained"
          color="primary"
          buttonText={t('label.create_label')}
          handleClick={() => setOpen(true)}
          size="large"
          data-testid="button"
        />
        <EditModal open={open} handleClose={() => setOpen(false)} refetch={refetch} type="new" />
      </div>
      <div className={classes.container}>
        {!matches && <ListHeader headers={labelsHeader} />}
        {data?.labels.map(label => (
          <LabelItem
            key={label.id}
            label={label}
            userType={userType}
            userCount={label.userCount}
            refetch={refetch}
          />
        ))}
      </div>
      <CenteredContent>
        <Paginate offSet={offset} limit={limit} active={offset >= 1} handlePageChange={paginate} />
      </CenteredContent>
    </PageWrapper>
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
  },
  container: {
    marginTop: '20px'
  }
}));

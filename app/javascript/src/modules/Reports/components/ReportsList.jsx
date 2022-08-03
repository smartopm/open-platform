import { Container, Grid } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import DataList from '../../../shared/list/DataList';
import Text from '../../../shared/Text';

export default function ReportList() {
  const { t } = useTranslation(['form', 'report']);
  const history = useHistory();
  const reportHeader = [{ title: 'Name', col: 1, value: t('misc.name') }];
  return (
    <Container>
      <DataList
        keys={reportHeader}
        data={renderFormReport(t)}
        hasHeader={false}
        clickable
        handleClick={() => history.push(`/customs_report`)}
      />
    </Container>
  );
}

function renderFormReport(translate) {
  return [
    {
      Name: (
        <Grid item xs={12} md={2} data-testid="report_name">
          <Text content={translate('report:misc.report_title')} component="p" />
        </Grid>
      )
    }
  ];
}

import { Grid } from '@material-ui/core';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import DataList from '../../../shared/list/DataList'
import Text from '../../../shared/Text';

export default function Report(){
    const { t } = useTranslation('form')
    const history = useHistory()
    const reportHeader = [
        { title: 'Name', col: 1, value: t('misc.name') },
        // { title: 'Created At', col: 1, value: t('misc.created_at') },
        // { title: 'Status', col: 1, value: t('misc.status') }
      ];
    return (
      <div>
        List of of reports will be here
        <DataList
          keys={reportHeader}
          data={renderFormReport()}
          hasHeader={false}
          clickable
          handleClick={() => history.push(`/customs_report`)}
        />
      </div>
    )
}

function renderFormReport(){
    return [
        {
            Name: (
              <Grid item xs={12} md={2} data-testid="report_name">
                <Text content="Customs Report" component="p" />
              </Grid>
            ),
        }
    ]
}
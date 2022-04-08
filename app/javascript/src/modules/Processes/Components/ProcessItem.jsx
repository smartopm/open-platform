import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Grid, IconButton, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Card from '../../../shared/Card';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function ProcessItem({ process, menuData }) {
  const { t } = useTranslation('process');
  const classes = useStyles();

  return(
    <Card styles={{ marginBottom: 0 }} contentStyles={{ padding: '4px' }}>
      <Grid container>
        <Grid item md={8} style={{ display: 'flex', alignItems: 'center', border: 'solid 1px red'}}>
            <Typography variant="body2" data-testid="process_name" component="p">
              {process.name}
            </Typography>
        </Grid>
        <Grid item={4}>
          <Grid container>
            <Grid item md={4} style={{ display: 'flex', alignItems: 'center', border: 'solid 1px blue'}}>
              <Link
                to={`/form/${process.form.id}`}
                color="primary"
                data-testid="btn-edit-process-form"
              >
                {t('templates.edit_form')}
              </Link>
            </Grid>
            <Grid item md={5} style={{ display: 'flex', alignItems: 'center', border: 'solid 1px yellow'}}>
              <Link
                to="/tasks/task_lists"
                color="primary"
                data-testid="btn-edit-process-task-list"
              >
                {t('templates.edit_task_list')}
              </Link>
            </Grid>
            <Grid item md={3} style={{ border: 'solid 1px green'}}>
              <IconButton
                aria-controls="process-kabab-menu"
                aria-haspopup="true"
                data-testid="process-item-menu"
                dataid={process.id}
                onClick={event => menuData.handleMenu(event)}
                color="primary"
                size="large"
              >
                <MoreVertIcon />
              </IconButton>
            </Grid>
            </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  },
});

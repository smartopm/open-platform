import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Grid, IconButton, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Card from '../../../shared/Card';

export default function ProcessItem({ process, menuData }) {
  const { t } = useTranslation('process');
  const classes = useStyles();

  return(
    <Card styles={{ marginBottom: 5 }} contentStyles={{ padding: '4px' }}>
      <Grid container>
        <Grid item md={9} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="body2"
            data-testid="process_name"
            component="p"
            className={classes.processName}
          >
            {process.name}
          </Typography>
        </Grid>
        <Grid item md={3} xs={12}>
          <Grid container>
            <Grid item md={4} xs={4} style={{ display: 'flex', alignItems: 'center' }}>
              <Link
                to={`/form/${process.form.id}`}
                color="primary"
                data-testid="btn-edit-process-form"
              >
                {t('templates.edit_form')}
              </Link>
            </Grid>
            <Grid item md={6} xs={6} style={{ display: 'flex', alignItems: 'center' }}>
              <Link
                to="/tasks/task_lists"
                color="primary"
                data-testid="btn-edit-process-task-list"
              >
                {t('templates.edit_task_list')}
              </Link>
            </Grid>
            <Grid item md={2} xs={1}>
              <IconButton
                aria-controls="process-kabab-menu"
                aria-haspopup="true"
                data-testid="process-item-menu"
                dataid={process.id}
                onClick={event => menuData.handleMenu(event, process)}
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


const FormWithProcess = {
  id: PropTypes.string,
}

const ProcessTaskList = {
  id: PropTypes.string,
}

const Process = {
  id: PropTypes.string,
  name: PropTypes.string,
  form: PropTypes.shape(FormWithProcess),
  noteList: PropTypes.shape(ProcessTaskList),
}
ProcessItem.propTypes = {
  process: PropTypes.shape(Process).isRequired,
  menuData: PropTypes.shape({
    handleMenu: PropTypes.func.isRequired,
    open: PropTypes.bool,
    anchorEl: PropTypes.shape({
      getAttribute: PropTypes.func
    }),
    handleClose: PropTypes.func,
    menuList: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
        isAdmin: PropTypes.bool,
        handleClick: PropTypes.func
      })
    )
  }).isRequired,
};

const useStyles = makeStyles({
  processName: {
    paddingLeft: '3px'
  },
});

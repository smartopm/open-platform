

import React from 'react';
import { makeStyles } from '@mui/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function CustomProgressBar({task, smDown}){
    const classes = useStyles();

    return (
      <>
        {smDown ? (
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Box className={classes.progressBar} data-testid="custom_progress_bar_mobile">
              <LinearProgress color='secondary' variant="determinate" value={task?.progress?.progress_percentage} />
            </Box>
            <Box className={classes.progressBarText} data-testid="custom_progress_bar_text_mobile">
              <Typography variant="body2">
                {task?.progress?.complete}
                {' '}
                of
                {' '}
                {task?.progress?.total}
              </Typography>
            </Box>
          </Box>
           ) : (
             <Box sx={{ width: '100%' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                 <Box sx={{ width: '100%', ml: 4, backgroundColor: 'black' }} data-testid="custom_progress_bar">
                   <LinearProgress color='secondary' variant="determinate" value={task?.progress?.progress_percentage} />
                 </Box>
                 <Box sx={{ minWidth: 5, ml: 4 }} data-testid="custom_progress_bar_text">
                   <Typography variant="body2">
                     {task?.progress?.complete}
                     {' '}
                     of
                     {' '}
                     {task?.progress?.total}
                   </Typography>
                 </Box>
               </Box>
             </Box>
        ) }
      </>

    )

}
const Task = {
  id: PropTypes.string,
  body: PropTypes.string,
  completed: PropTypes.bool,
  author: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  }),
  assignees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  ),
  subTasks: PropTypes.arrayOf(PropTypes.object),
  dueDate: PropTypes.string
};


CustomProgressBar.propTypes = {
  smDown: PropTypes.bool.isRequired,
  task: PropTypes.shape(Task).isRequired,
}


const useStyles = makeStyles(() => ({
    progressBar: {
      '@media (min-device-width: 320px) and (max-device-height: 568px) and (orientation: portrait)' : {
        marginLeft: "-40px",
        marginTop: '10px',
        width: '100%'
      },
      '@media (min-device-width: 280px) and (max-device-height: 653px) and (orientation: portrait)' : {
        marginLeft: "-40px",
        marginTop: '10px',
        width: '100%'
      },
      '@media (min-device-width: 360px) and (max-device-height: 640px) and (orientation: portrait)' : {
        marginLeft: "-40px",
        marginTop: '10px',
        width: '100%'
      },
      // sumsung S8
      '@media (min-device-width: 360px) and (max-device-height: 740px) and (orientation: portrait)' : {
        marginLeft: "-40px",
        marginTop: '10px',
        width: '100%'
      },
      '@media (min-device-width: 375px) and (max-device-height: 812px) and (orientation: portrait)' : {
        marginLeft: "-50px",
        marginTop: '10px',
        width: '100%'
      },
      // iPhone 12 pro
      '@media (min-device-width: 390px) and (max-device-height: 844px) and (orientation: portrait)' : {
        marginLeft: "-50px",
        marginTop: '10px',
        width: '100%'
      },
      // pixel 5
      '@media (min-device-width: 393px) and (max-device-height: 851px) and (orientation: portrait)' : {
        marginLeft: "-50px",
        marginTop: '10px',
        width: '100%'
      },
      '@media (min-device-width: 411px) and (max-device-height: 915px) and (orientation: portrait)' : {
        marginLeft: "-50px",
        marginTop: '10px',
        width: '100%'
      },
      '@media (min-device-width: 412px) and (max-device-height: 914px) and (orientation: portrait)' : {
        marginLeft: "-70px",
        marginTop: '10px',
        width: '100%'
      },
      // iPhone XR
      '@media (min-device-width: 414px) and (max-device-height: 896px) and (orientation: portrait)' : {
        marginLeft: "-50px",
        marginTop: '10px',
        width: '100%'
      },

      '@media (min-device-width: 768px) and (max-device-height: 1368px) and (orientation: portrait)' : {
        marginLeft: "-150px",
        marginTop: '10px',
        width: '100%'
      },

      '@media (min-device-width: 500px) ' : {
        marginLeft: "-140px",
        marginTop: '10px',
        width: '100%'
      },
    },
    progressBarText: {
      '@media (min-device-width: 280px) and (max-device-height: 653px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },
      '@media (min-device-width: 320px) and (max-device-height: 568px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },
      '@media (min-device-width: 360px) and (max-device-height: 640px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },
      // sumsung S8
      '@media (min-device-width: 360px) and (max-device-height: 740px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },
      '@media (min-device-width: 375px) and (max-device-height: 812px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },
      '@media (min-device-width: 375px) and (max-device-height: 667) and (orientation: portrait)' : {
        marginLeft: '-60px'
      },
      // iPhone 12 pro
      '@media (min-device-width: 390px) and (max-device-height: 844px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },

      // pixel 5
      '@media (min-device-width: 393px) and (max-device-height: 851px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },

      // iPhone XR
      '@media (min-device-width: 414px) and (max-device-height: 896px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },

      '@media (min-device-width: 411px) and (max-device-height: 915px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },
      '@media (min-device-width: 412px) and (max-device-height: 914px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },
      '@media (min-device-width: 768px) and (max-device-height: 1368px) and (orientation: portrait)' : {
        marginLeft: "0",
        width: '100%'
      },
      '@media (min-device-width: 500px) ' : {
        marginLeft: "0",
        width: '100%'
      },
    },

  }));

  
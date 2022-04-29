// import React from 'react';
// import Grid from '@mui/material/Grid';
// import Avatar from '@mui/material/Avatar';
// import Chip from '@mui/material/Chip';
// import Typography from '@mui/material/Typography';
// import { useTranslation } from 'react-i18next';
// import UserNameAvatar from '../../../../shared/UserNameAvatar';
// import { objectAccessor } from '../../../../utils/helpers';
// import { dateToString } from '../../../../components/DateContainer';

// export default function ProcessCommentItem({ commentdata, commentType }) {
//   const statusColors = {
//     Sent: 'info',
//     Received: 'warning',
//     Resolved: 'success'
//   };
//   const { t } = useTranslation(['process', 'task']);
//   return (
//     <>
//       <Grid container spacing={2}>
//         <Grid item md={2}>
//           <Chip
//             label={commentType}
//             color={objectAccessor(statusColors, commentType)}
//             size="small"
//             style={{ fontSize: '14px' }}
//             data-testid="sent-chip"
//           />
//           <Typography
//             variant="caption"
//             // style={comment.status ? { margin: '0 15px' } : { marginRight: '15px' }}
//           >
//             {dateToString(commentdata.createdAt)}
//           </Typography>
//           {commentType !== 'Resolved' && (
//             <Typography variant="caption" style={{ marginRight: '15px' }}>
//               {commentType === 'Received'
//                 ? t('task.reply_submitted')
//                 : `${t('task.reply_sent_to')} ${commentdata.replyFrom.name}`}
//             </Typography>
//           )}
//         </Grid>
//         {/* <Grid item md={12}>
//           <Avatar
//             src={comment.user.imageUrl}
//             alt="avatar-image"
//             style={{ margin: '-2px 10px 0 0', width: '25px', height: '25px' }}
//           />
//           <Typography variant="caption">{comment.user.name}</Typography>
//         </Grid> */}
//         {/* <Grid item md={12}>
//           {commentdata.body}
//         </Grid> */}
//       </Grid>
//     </>
//   );
// }

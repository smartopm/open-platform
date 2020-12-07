// /* eslint-disable */
// import React, { useState } from 'react'
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import MenuItem from '@material-ui/core/MenuItem';
// import { makeStyles } from '@material-ui/core/styles';
// import Avatar from '@material-ui/core/Avatar';
// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
// import { useApolloClient } from 'react-apollo'
// import PropTypes from 'prop-types'
// import ImageCropper from './ImageCropper'
// import { useFileUpload } from '../../graphql/useFileUpload'

// export default function CommunityPage({ data }){
//   const classes = useStyles();
//   const [blob, setBlob] = useState(null)
//   const [inputImg, setInputImg] = useState('')
//   const [fileName, setFileName] = useState('')

//   function getBlob(blobb) {
//     // pass blobb up from the ImageCropper component
//     setBlob(blobb)
//   }

//   function handleChange(e){
//     console.log(e.target.value)
//   }

//   function onInputChange(file) {
//     setFileName(file.name)
//     // convert image file to base64 string
//     const reader = new FileReader()

//     reader.addEventListener('load', () => {
//       setInputImg(reader.result)
//     }, false)

//     if (file) {
//       reader.readAsDataURL(file)
//     }
//   }

//   const {
//     onChange, status, url, signedBlobId
//   } = useFileUpload({
//     client: useApolloClient()
//   })

//   return (
//     <>
//       <Typography variant='h6'>Community Logo</Typography>
//       <Typography variant='caption'>You can change your community logo here</Typography>
//       <div className={classes.avatar}>
//         <Avatar alt="avatar-image" src={data.logoUrl} style={{height: '70px', width: '70px'}} />
//         <div className={classes.upload}>
//           <Typography variant='caption' style={{fontWeight: 'bold', marginLeft: '10px'}}>Upload new logo</Typography>
//           <div>
//             <Button
//               variant="contained"
//               component="label"
//             >
//               Choose File
//               <input
//                 type="file"
//                 hidden
//                 onChange={event => onInputChange(event.target.files[0])}
//                 accept="image/*"
//               />
//             </Button>
//           </div>
//         </div>
//       </div>
//       <div style={{position: 'relative'}}>
//         {status !== 'DONE' && inputImg && <ImageCropper getBlob={getBlob} inputImg={inputImg} fileName={fileName} />}
//       </div>
//       {status !== 'DONE' && blob && <Button variant='contained' style={{margin: '10px'}} onClick={() => onChange(blob)}>Upload</Button>}
//       {console.log(status)}
//       <div className={classes.information} style={{marginTop: '40px'}}>
//         <Typography variant='h6'>Support Contact Information</Typography>
//         <Typography variant='caption'>Make changes to your contact information here.</Typography>
//         {data?.supportNumber ? 
//            Object.entries(data.supportNumber).map(([key, val]) => (
//              <div className={classes.textField} key={val}>
//                <TextField id="input" label="Phone Number" value={val} type="number" />
//                <TextField
//                  id="select-category"
//                  style={{width: '200px', marginLeft: '40px'}}
//                  select
//                  label="Select Category"
//                  value={key}
//                  onChange={handleChange}
//                >
//                  <MenuItem value="sales">Sales</MenuItem>
//                  <MenuItem value="customer_care">Customer Care</MenuItem>
//                </TextField>
//              </div>
//           )) : null}
//         <div className={classes.addIcon}>
//           <AddCircleOutlineIcon />
//           <div style={{marginLeft: '10px', color: 'secondary'}}>
//             <Typography align='center' variant='caption'>Add New Phone Number</Typography>
//           </div>
//         </div>
//       </div>
//       <div className={classes.information} style={{marginTop: '40px'}}>
//         { data?.supportEmail ?
//           Object.entries(data.supportEmail).map(([key, val]) => (
//             <div className={classes.textField} key={val}>
//               <TextField id="input" label="Email Address" value={val} type="email" />
//               <TextField
//                 id="select-category"
//                 style={{width: '200px', marginLeft: '40px'}}
//                 select
//                 label="Select Category"
//                 value={key}
//                 onChange={handleChange}
//               >
//                 <MenuItem value="sales">Sales</MenuItem>
//                 <MenuItem value="customer_care">Customer Care</MenuItem>
//               </TextField>
//             </div>
//           )) : null }
//         <div className={classes.addIcon}>
//           <AddCircleOutlineIcon />
//           <div style={{marginLeft: '10px', color: 'secondary'}}>
//             <Typography align='center' variant='caption'>Add New Email Address</Typography>
//           </div>
//         </div>
//         <div className={classes.button}>
//           <Button variant='contained' color='primary'>UPDATE COMMUNITY SETTINGS</Button>
//         </div>
//       </div>
//     </>
//   )
// }

// const useStyles = makeStyles({
//   avatar: {
//     display: 'flex',
//     flexDirection: 'row',
//     margin: '20px 0'
//   },
//   upload: {
//     display: 'flex',
//     flexDirection: 'column',
//     margin: '0 10px'
//   },
//   information: {
//     display: 'flex',
//     flexDirection: 'column'
//   },
//   textField: {
//     display: 'flex',
//     flexDirection: 'row',
//     margin: '10px 0'
//   },
//   addIcon: {
//     display: 'flex',
//     marginTop: '20px',
//     color: '#6CAA9F'
//   },
//   button: {
//     marginTop: '15px'
//   }
// });

// CommunityPage.propTypes = {
//     data: PropTypes.shape({
//         id: PropTypes.string,
//         logoUrl: PropTypes.string,
//         supportEmail: PropTypes.object,
//         supportNumber: PropTypes.object
//     }).isRequired
//   }
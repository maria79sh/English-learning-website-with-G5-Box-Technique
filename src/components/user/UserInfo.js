// import React, { useEffect, useState } from 'react';
// import { apiRequest } from '../../apiServer/api';
// // import classes from "./UserInfo.module.css"
//  import classes from './UserProfile.module.css';
//
// import UserIcon from "./UserIcon";
//
// const UserInfo = (show, user, onLogout, onEditProfile) => {
//     const [userInfo, setUserInfo] = useState(null);
//     const [avatar, setAvatar] = useState(null);
//     const [avatarUrl, setAvatarUrl] = useState(null);
//
//     const token = localStorage.getItem('token');
//     console.log(token);
//
//
//     useEffect(() => {
//         const fetchUserInfo = async () => {
//             try {
//                 const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
//                 setUserInfo(data);
//             } catch (error) {
//                 console.error('Error fetching user info:', error);
//             }
//         };
//         fetchUserInfo();
//     }, []);
//     useEffect(() => {
//         const fetchAvatar = async () => {
//             try {
//                 const data = await apiRequest('http://127.0.0.1:8080/api/v1/get_avatars');
//                 setAvatar(data);
//                 console.log(avatar);
//             } catch (error) {
//                 console.error('Error fetching user info:', error);
//             }
//         };
//         fetchAvatar();
//     }, []);
//
//      if (!userInfo) return <div>Loading...</div>;
//
//     const handleLogout = () => {
//         // Add your logout logic here
//         console.log('User logged out');
//     };
//
//     const handleEditProfile = () => {
//         // Add your edit profile logic here
//         console.log('Edit profile clicked');
//     };
//
//     if (!show) {
//         return null;
//     }
//     return (
//         <div className={classes.dropdown}>
//             {/*<pre>{JSON.stringify(userInfo, null, 2)}</pre>*/}
//                 <div className={classes.avatar}>
//                 {/*<UserIcon></UserIcon>*/}
//                 </div>
//                     <div className={classes.user_details}>
//                         <div className={classes.user_info}><strong>Username:</strong> {userInfo.username}</div>
//                         <div className={classes.user_info}><strong>Phone:</strong> {userInfo.phone}</div>
//                         <div className={classes.user_info}><strong>Age:</strong> {userInfo.age}</div>
//                     </div>
//                 <div className={classes.actions}>
//                     <button className={classes.profile_button} onClick={handleEditProfile}>Edit Profile</button>
//                     <button className={classes.profile_button} onClick={handleLogout}>Logout</button>
//                 </div>
//             </div>
//     );
// };
//
// export default UserInfo;

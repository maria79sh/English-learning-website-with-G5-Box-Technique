import React, {useEffect, useState} from "react";
import {Fragment} from "react";
import "../style/EditUser.css";
import { useNavigate } from 'react-router-dom';
import {apiRequest} from "../../apiServer/api";


function EditProfile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [avatars, setAvatars] = useState([]);
    const baseURL = 'http://127.0.0.1:8080';
    const [formData, setFormData] = useState({
        password: '',
        confirm_password: '',
        avatar: '',
        name : '',
        phone : ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                setUser(data.username);

            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserData();
    }, []);


    const handleAvatarSelect = (avatar) => {
        setFormData({ ...formData, avatar });
    };

    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const response = await fetch(`${baseURL}/api/v1/get_avatars`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Fetched avatars:', data);
                setAvatars(data);
            } catch (error) {
                console.error('Error fetching avatars:', error);
            }
        };

        fetchAvatars();
    }, []);


    const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/edit_profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(' response was not ok');
            }

            const data = await response.json();
            console.log('Profile updated successfully:', data);
            alert('edit successful');
            navigate('/home');


        } catch (error) {
            console.error('Error updating profile:', error);
            alert('edit unsuccessful:(');

        }
    };
    return (
        <div className="editBody">
            <section className="editMain">
                <input type="checkbox" id="chk" aria-hidden="true"/>
                <div className="edit">
                    <form>
                        <label htmlFor="chk" aria-hidden="true"> ویرایش اطلاعات</label>
                        <label>کاربر : {user}</label>
                        <input type="text" name="phone" placeholder="شماره همراه" required="" value={formData.phone}
                               onChange={handleChange}/>
                        <input type="text" name="name" placeholder="نام" required="" value={formData.name}
                               onChange={handleChange}/>
                        <input type="password" name="password" placeholder="رمز عبور" required="" value={formData.password}
                               onChange={handleChange}/>
                        <input type="password" name="confrim_password" placeholder="تکرار رمز عبور" required="" value={formData.confrim_password}
                               onChange={handleChange}/>

                        <div className="avatar-selection">
                            {avatars.map((avatar, index) => (
                                <img
                                    key={index}
                                    src={`${baseURL}/${avatar}`}
                                    alt={`Avatar ${index}`}
                                    className={`avatar ${formData.avatar === avatar ? 'selected' : ''}`}
                                    onClick={() => handleAvatarSelect(avatar)}
                                />
                            ))}
                        </div>
                        <button onClick={handleSubmit}>ثبت تغییرات</button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default EditProfile;

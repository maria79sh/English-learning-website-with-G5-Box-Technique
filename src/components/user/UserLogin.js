import React, {useEffect, useState} from "react";
import {Fragment} from "react";
import "../style/UserLogin.css";
import { useNavigate } from 'react-router-dom';


function UserLogin() {
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const baseURL = 'http://127.0.0.1:8080';

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        avatar : '',
        // age : 0,
        name : '',
        phone : ''
    });

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        phone: ''
    });

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
                setAvatars(data);
            } catch (error) {
                console.error('Error fetching avatars:', error);
            }
        };

        fetchAvatars();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate the inputs
      if (name === 'phone' && (!/^\d*$/.test(value))) {
            setErrors(prevState => ({
                ...prevState,
                phone: 'ورودی باید عدد باشد'
            }));
        } else {
            setErrors(prevState => ({
                ...prevState,
                [name]: ''
            }));
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const loginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAvatarSelect = (avatar) => {
        setFormData({ ...formData, avatar });
    };


    const handleSubmit = async (e) => {
        console.log('Submitting form data:', formData);

        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('User registered:', result);
                alert("ثبت نام با موفقیت انجام شد!")
            } else if (response.status === 403) {
                setErrors(prevState => ({
                    ...prevState,
                    username: 'حسابی با این نام کاربری وجود دارد'
                }));
            }else {
                console.error('Failed to register');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

  //login
    const handleLogin = async (e) =>
    {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json',
                },
                body: new URLSearchParams({
                    grant_type: '',
                    username: loginData.username,
                    password: loginData.password,
                    scope: '',
                    client_id: '',
                    client_secret: ''
                })
            });

            const data = await response.json();
            const token = data.access_token;

            if (response.ok) {
                localStorage.setItem('token', token);
                navigate('/home');

            } else {
                alert(' خطا رخ داد : ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('خطا رخ داد. لطفا دوباره تلاش کنید.');
        }
    };




    return (
        <div className="loginBody">
            <section className="loginMain">


                <input type="checkbox" id="chk" aria-hidden="true"/>
                <div className="signup">
                    <form>
                        <label className="registerlabel" htmlFor="chk" aria-hidden="true">ثبت نام</label>
                        <input type="text" name="username" placeholder="نام کاربری" required=""
                               value={formData.username}
                               onChange={handleChange} />
                        {errors.username && <p className="error">{errors.username}</p>}
                        <input type="password" name="password" placeholder="رمزعبور" required="" value={formData.password}
                               onChange={handleChange}/>
                        <input type="password" name="confirm_password" placeholder="تایید رمز عبور" required="" value={formData.confirm_password}
                               onChange={handleChange}/>
                        <input type="name" name="name" placeholder="نام" required="" value={formData.name}
                               onChange={handleChange}/>
                        <input type="text" name="phone" placeholder="شماره تلفن" required="" value={formData.phone}
                               onChange={handleChange}/>
                        {errors.phone && <p className="error">{errors.phone}</p>}


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
                        <button onClick={handleSubmit}  >ثبت نام کن!</button>

                    </form>
                </div>

                <div className="login">
                    <form>
                        <label htmlFor="chk" aria-hidden="true">قبلا ثبت نام کردی؟</label>
                        <input type="text" name="username" placeholder="نام کاربری" required=""
                               value={loginData.username}
                               onChange={loginChange}/>
                        <input type="password" name="password" placeholder="رمزعبور" required=""
                               value={loginData.password}
                               onChange={loginChange}/>

                        <button onClick={handleLogin}>وارد شو!</button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default UserLogin;

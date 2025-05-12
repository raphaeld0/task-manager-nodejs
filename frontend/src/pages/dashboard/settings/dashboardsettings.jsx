import React, { useState, useEffect } from 'react';
import styles from './dashboardSettings.module.css';
import iconExample from '../../../assets/imgs/iconexample.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../../service/api';
import decodeToken from '../../../service/jwtDecode';
import checkToken from '../../../service/checkToken';

function DashboardSettings() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('pt-BR'));
    const [formattedDate, setFormattedDate] = useState('');
    const [dailyReminder, setDailyReminder] = useState('');
    const [tasks, setTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const navigate = useNavigate();
    const decoded = decodeToken();


    let firstName = 'User';
    if (decoded && decoded.username) {
        const firstNameC = decoded.username.split(' ')[0];
        firstName = firstNameC.charAt(0).toUpperCase() + firstNameC.slice(1);
    }
    useEffect(() => {
        document.title = 'Dashboard';

        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
            setCurrentDate(new Date().toLocaleDateString('pt-BR'));

            const options = { month: 'long', day: 'numeric' };
            setFormattedDate(new Date().toLocaleDateString('en-US', options));

            const dayOfWeek = new Date().getDay();
            const reminders = [
                "Start your week strong! 💪",
                "Keep pushing forward! 🚀",
                "You're halfway there! 🌟",
                "Stay focused and keep going! 🔥",
                "Almost the weekend! 🎉",
                "Enjoy your Friday! 🥳",
                "Take time to relax! 🌟"
            ];
            setDailyReminder(reminders[dayOfWeek]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get('/task', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log('Response:', response.data);

                const tasksData = response.data.tasks;
                setTasks(tasksData);
                setTotalTasks(response.data.totalTasks);

                const completed = tasksData.filter(task => task.status === true).length;
                const pending = tasksData.filter(task => task.status === false).length;

                setCompletedTasks(completed);
                setPendingTasks(pending);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchTasks();
    }, [navigate]);
    useEffect(() => {
        checkToken(navigate);
    }, [navigate]);

    const logOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const updateUsername = async () => {
        const newUsername = document.querySelector('.inputName input').value;

        if (!newUsername) {
            alert('Please enter a new username.');
            return;
        }

        const userId = decoded.id;

        try {
            const response = await api.put(`/userchange/${userId}`, {
                username: newUsername,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            console.log('Username updated:', response.data);
            alert('Username updated successfully!');

            localStorage.setItem('token', response.data.token);
        } catch (error) {
            console.error('Error updating username:', error.response?.data || error.message);
            alert('Error updating username.');
        }
    };
    const updateEmail = async () => {
        const newEmail = document.querySelector('.inputEmail input').value;

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!newEmail) {
            alert('Please enter a new email.');
            return;
        }

        if (!emailPattern.test(newEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        const userId = decoded.id;

        try {
            const response = await api.put(`/emailchange/${userId}`, {
                email: newEmail,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            console.log('Email updated:', response.data);
            alert('Email updated successfully!');

            localStorage.setItem('token', response.data.token);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert('That email already exists in our database.');
            }
            console.error('Error updating email:', error.response?.data || error.message);
        }
    };



    return (
        <>
            <div className={styles.page}>
                <div className={styles.topBar}>
                    <div className="left">
                        <h1><span className={styles.dash}>Dash</span>board</h1>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.data}>
                            <div className={styles.time}><p>{currentTime}</p></div>
                            <div className={styles.date}><p>{currentDate}</p></div>
                        </div>
                    </div>
                </div>

                <div className={styles.leftBar}>
                    <img src={iconExample} className={styles.icon} alt="" />
                    <h1>{firstName}</h1>
                    <p>{decoded.email}</p>

                    <Link to="/dashboard"><button>Dashboard</button></Link>
                    <Link to="/dashboard/tasks"><button>Tasks</button></Link>
                    <Link to="/dashboard/settings"><button className={styles.activeButton}>Settings</button></Link>
                    <div className={styles.logout}><button onClick={logOut}>Logout</button></div>
                </div>
                <div className={styles.content}>
                    <h1>Account Settings</h1>
                    <div className={styles.settingsDiv}> <p> User</p>
                        <div className={`${styles.divName} inputName`}>
                            <input type="text" className={styles.inputName}  placeholder="New Username" />
                            <button onClick={updateUsername}>Confirm</button>
                        </div><p> Email</p>
                        <div className={`${styles.divEmail} inputEmail`}> 
                             <input type="email"  className={styles.emailName}  placeholder="New Email" />
                            <button onClick={updateEmail}>Confirm</button>
                        </div>
                        <h2>Please confirm your new info before proceeding with change.</h2>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardSettings;
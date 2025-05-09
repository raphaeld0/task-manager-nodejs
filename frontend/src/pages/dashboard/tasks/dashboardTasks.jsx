import React, { useState, useEffect } from 'react';
import styles from './dashboardTasks.module.css';
import iconExample from '../../../assets/imgs/iconexample.png';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../service/api';
import decodeToken from '../../../service/jwtDecode'


function DashboardTasks() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('pt-BR'));
    const [tasks, setTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const navigate = useNavigate();
    const decoded = decodeToken();

    const firstNameC = decoded.username.split(' ')[0];
    const firstName = firstNameC.charAt(0).toUpperCase() + firstNameC.slice(1);

    useEffect(() => {
        document.title = 'Dashboard - Tasks';

        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
            setCurrentDate(new Date().toLocaleDateString('pt-BR'));
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
                setTasks(response.data.tasks);
                setTotalTasks(response.data.totalTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchTasks();
    }, [navigate]);

    const logOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
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
                    <Link to="/dashboard/tasks"><button className={styles.activeButton}>Tasks</button></Link>
                    <Link to="/dashboard/settings"><button>Settings</button></Link>
                    <Link to="/dashboard/help"><button>Help</button></Link>
                    <div className={styles.logout}><button onClick={logOut}>Logout</button></div>
                </div>

                <div className={styles.content}>
                    <h1>Welcome back, {firstName} <span className={styles.emote}>👋</span></h1>

                    <div className={styles.todoDiv}>
                        <div className={styles.taskAddBTN}>
                            <div className="emotetodo">
                            <svg className={styles.emote2} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" strokeWidth="2">
                                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                <path d="M9 12h6"></path>
                                <path d="M9 16h6"></path>
                            </svg>                      To-Do</div>
                            <Link to="/dashboard/tasks"><button className={styles.MAIS}>
                                <span>+</span> Add Task
                            </button></Link></div><div className="tasks">
                            {tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <div key={index} className={styles.taskItem}>
                                        <div className={styles.titleStatus}>
                                            <h2>{task.title}</h2> <div className={styles.status}>Status: {task.status ? 'Completed' : 'Pending'}</div> </div>
                                        <p>{task.description}</p>
                                        <p className={styles.status}></p>
                                    </div>
                                ))
                            ) : (
                                <p>No tasks available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardTasks;
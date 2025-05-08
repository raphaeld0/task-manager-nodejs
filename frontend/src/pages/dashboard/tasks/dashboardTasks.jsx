import React, { useState, useEffect } from 'react';
import styles from './dashboardTasks.module.css';
import iconExample from '../../../assets/imgs/iconexample.png';
import { useNavigate, Link } from 'react-router-dom';

function DashboardTasks() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('pt-BR'));

    useEffect(() => {
        document.title = 'Dashboard';

        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
            setCurrentDate(new Date().toLocaleDateString('pt-BR'));

        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
                <h1>Raphael Dias</h1>
                <p>raphael@gmail.com</p>

                <Link to="/dashboard"><button>Dashboard</button></Link>
                <Link to="/dashboard/tasks"><button className={styles.activeButton}>Tasks</button></Link>
                <Link to="/dashboard/settings"><button>Settings</button></Link>
                <Link to="/dashboard/help"><button>Help</button></Link>
                <div className={styles.logout}><button>Logout</button></div>
            </div>

            <div className={styles.content}>
                <h1>Welcome back, Raphael <span className={styles.emote}>👋</span></h1>

            </div></div>
        </>
    );
}

export default DashboardTasks;
import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import iconExample from '../../assets/imgs/iconexample.png';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('pt-BR'));
    const [formattedDate, setFormattedDate] = useState('');
    const [dailyReminder, setDailyReminder] = useState('');

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

    return (
        <><div className={styles.page}>
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


                <Link to="/dashboard"><button className={styles.activeButton}>Dashboard</button></Link>
                <Link to="/dashboard/tasks"><button>Tasks</button></Link>
                <Link to="/dashboard/settings"><button>Settings</button></Link>
                <Link to="/dashboard/help"><button>Help</button></Link>
                <div className={styles.logout}><button>Logout</button></div>
            </div>

            <div className={styles.content}>
                <h1>Welcome back, Raphael <span className={styles.emote}>👋</span></h1>
                <div className={styles.contentsemH1}>

                    <div className={styles.todoDiv}>
                        <svg className={styles.emote2} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                            <path d="M9 12h6"></path>
                            <path d="M9 16h6"></path>
                        </svg>

                        To-Do

                        <div className={styles.formattedDate}><p>{formattedDate} <span> - Today </span></p></div>
                        <Link to="/dashboard/tasks"><button className={styles.MAIS}>
                            <span>+</span> Add Task
                        </button></Link>
                    </div>

                    <div className={styles.taskDiv}>
                        <div>
                            <svg className={styles.emoteTask} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                <path d="M9 14l2 2l4 -4"></path>
                            </svg>
                            Tasks Status
                        </div>
                        <div className={styles.itemTask}>
                            <div className={styles.complete}>You’ve completed <span>500 </span> tasks so far.</div>
                            <div className={styles.fazendo}>There are currently <span> 200 </span> tasks ongoing.</div>
                            <div className={styles.fazendo}>You’ve got <span>200</span>  tasks in total. Keep it up!</div>
                        </div>
                    </div>
                    <div className={styles.remDiv}>
                        <svg className={styles.emote3} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                            <path d="M11.993 16.75l2.747 -2.815a1.9 1.9 0 0 0 0 -2.632a1.775 1.775 0 0 0 -2.56 0l-.183 .188l-.183 -.189a1.775 1.775 0 0 0 -2.56 0a1.899 1.899 0 0 0 0 2.632l2.738 2.825z"></path>
                        </svg>
                        Today's Reminder
                        <div className={styles.msg}>{dailyReminder}</div>
                    </div>

                </div>

            </div></div>
        </>
    );
}

export default Dashboard;
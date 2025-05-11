import React, { useState, useEffect } from 'react';
import styles from './dashboardTasks.module.css';
import iconExample from '../../../assets/imgs/iconexample.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../../service/api';
import decodeToken from '../../../service/jwtDecode';
import checkToken from '../../../service/checkToken';

function DashboardTasks() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('pt-BR'));
    const [tasks, setTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const decoded = decodeToken();
    const location = useLocation();

    const openModal = () => {
        setNewTaskTitle('');
        setNewTaskDescription('');
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

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
        if (location.state?.openModal) {
            openModal();
            navigate(location.pathname, { replace: true });
        }

    }, [location]);
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

                if (error.response && error.response.status === 403) {
                    console.error('Token is invalid or expired');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        checkToken(navigate);
        fetchTasks();
    }, [navigate]);

    const logOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const newTask = {
            title: newTaskTitle,
            description: newTaskDescription,
            status: false,
        };

        try {
            await addTask(newTask);

            setNewTaskTitle('');
            setNewTaskDescription('');
            closeModal();
            window.location.reload();
        } catch (error) {
            console.error('Error adding task:', error);
        }

    };

    const addTask = async (task) => {
        try {
            const response = await api.post('/task', task, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTasks([...tasks, response.data]);
        } catch (error) {
            console.error('Error adding task:', error);
        }


    }
    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/task/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

        } catch (error) {
            console.error('Error deleting task:', error);
        }
        window.location.reload();
    };


    const updateTaskStatus = async (taskId) => {
        try {
            const response = await api.put(`/task/${taskId}`, { status: true }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, status: true } : task
                )

            );
        } catch (error) {
            console.error('Error updating task status:', error);
        }
        window.location.reload();
    }
    return (
        <>
            <div className={styles.page}>
                <div className={styles.topBar}>
                    <div className="left">
                        <h1>
                            <span className={styles.dash}>Dash</span>board
                        </h1>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.data}>
                            <div className={styles.time}>
                                <p>{currentTime}</p>
                            </div>
                            <div className={styles.date}>
                                <p>{currentDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.leftBar}>
                    <img src={iconExample} className={styles.icon} alt="User Icon" />
                    <h1>{firstName}</h1>
                    <p>{decoded.email}</p>

                    <Link to="/dashboard">
                        <button onClick={checkToken}>Dashboard</button>
                    </Link>
                    <Link to="/dashboard/tasks">
                        <button className={styles.activeButton}>Tasks</button>
                    </Link>
                    <Link to="/dashboard/settings">
                        <button>Settings</button>
                    </Link>
                    <Link to="/dashboard/help">
                        <button>Help</button>
                    </Link>
                    <div className={styles.logout}>
                        <button onClick={logOut}>Logout</button>
                    </div>
                </div>

                <div className={styles.content}>
                    <h1>
                        Welcome back, {firstName} <span className={styles.emote}>👋</span>
                    </h1>

                    <div className={styles.todoDiv}>
                        <div className={styles.taskAddBTN}>
                            <div className="emotetodo">
                                <svg
                                    className={styles.emote2}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    width="24"
                                    height="24"
                                    strokeWidth="2"
                                >
                                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                    <path d="M9 12h6"></path>
                                    <path d="M9 16h6"></path>
                                </svg>
                                To-Do
                            </div>
                            <button className={styles.MAIS} onClick={openModal}>
                                <span>+</span> Add Task
                            </button>
                        </div>

                        <ol className={styles.taskList}>
                            {tasks.length > 0 ? (
                                tasks
                                    .slice()
                                    .sort((a, b) => a.status - b.status)
                                    .map((task, index) => (
                                        <li key={index} className={styles.taskItem}>
                                            <div className={styles.titleStatus}>
                                                <h2>{task.title}</h2>
                                                <div className={styles.status}>
                                                    Status: {task.status ? 'Completed' : 'Pending'}
                                                </div>
                                            </div>
                                            <p>{task.description}</p>
                                            <div className={styles.buttons}>
                                                <button
                                                    className={styles.confirmButton}
                                                    onClick={() => updateTaskStatus(task._id)}
                                                    disabled={task.status}
                                                >
                                                    Finish Task
                                                </button>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => deleteTask(task._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))
                            ) : (
                                <p>No tasks available</p>
                            )}
                        </ol>
                    </div>
                </div>
            </div>


            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Add New Task</h2>
                        <form onSubmit={handleAddTask}>
                            <label ><div className={styles.ti}>
                                Title:</div>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    required
                                    className={styles.title}
                                    placeholder='Do super cool stuff!'
                                />
                            </label>
                            <label><div className={styles.desc}>
                                Description:</div>
                                <textarea
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    required
                                    className={styles.description}
                                    placeholder='Climb a mountain, go to the beach...'
                                />
                            </label>
                            <div className={styles.modalBtn}>
                                <button type="submit">Add Task</button>
                                <button type="button" onClick={closeModal} className={styles.cancel}>
                                    Cancel
                                </button></div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default DashboardTasks;
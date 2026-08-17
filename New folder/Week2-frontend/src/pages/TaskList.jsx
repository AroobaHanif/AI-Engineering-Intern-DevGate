import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTasks, createTask, deleteTask } from "../api/tasks";
import { getCurrentUserId } from '../utils/auth';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const currentUserId = getCurrentUserId();

    const loadTasks = () => {
        getTasks().then((data) => setTasks(data));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        loadTasks();
    }, []);
    
    const handleAddTask = async (e) => {
        e.preventDefault();
        await createTask({ title, description, status: 'pending', lectures: [] });
        setTitle('');
        setDescription('');
        loadTasks();
    };

    const handleDelete = async (id) => {
        await deleteTask(id);
        loadTasks();       
    };

    const getProgress = (task) => {
        if (!task.lectures || task.lectures.length === 0) return 0;
        const done = task.lectures.filter((l) => l.completedBy && l.completedBy.includes(currentUserId)).length;
        return Math.round((done / task.lectures.length) * 100);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>My Courses</h1>
                <Link to="/dashboard" className="nav-link">Back to Dashboard</Link>
            </header>

            <form onSubmit={handleAddTask} className="add-task-form">
                <input type="text" placeholder="Course title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="text" placeholder="Course description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <button type="submit">Add Course</button>
            </form>

            <div className="course-grid">
                {tasks.map((task) => (
                    <div key={task._id} className="course-card">
                        <h3>{task.title}</h3>
                        <p className="course-desc">{task.description}</p>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${getProgress(task)}%` }}></div>
                        </div>
                        <p className="progress-text">{getProgress(task)}% complete</p>
                        <div className="course-actions">
                            <Link to={`/tasks/${task._id}`} className="nav-link">Start Learning</Link>
                            <button onClick={() => handleDelete(task._id)} className="delete-btn">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskList;
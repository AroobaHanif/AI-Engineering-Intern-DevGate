import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, deleteTask, enrollCourse } from '../api/tasks';

function getCurrentUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return JSON.parse(atob(token.split('.')[1])).userId;
}

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const loadTasks = () => {
    getTasks()
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    loadTasks();
  }, []);

  const isEnrolled = (task) => task.enrolledBy && task.enrolledBy.includes(currentUserId);

  const getProgress = (task) => {
    if (!task.lectures || task.lectures.length === 0) return 0;
    const done = task.lectures.filter((l) => l.completedBy && l.completedBy.includes(currentUserId)).length;
    return Math.round((done / task.lectures.length) * 100);
  };

  const getChartData = () => tasks.map((t) => ({ name: t.title, progress: getProgress(t) }));

  const totalLectures = tasks.reduce((sum, t) => sum + (t.lectures ? t.lectures.length : 0), 0);
  const completedLectures = tasks.reduce((sum, t) => {
    if (!t.lectures) return sum;
    return sum + t.lectures.filter((l) => l.completedBy && l.completedBy.includes(currentUserId)).length;
  }, 0);

  const handleAddTask = async (e) => {
    e.preventDefault();
    await createTask({ title, description, lectures: [] });
    setTitle('');
    setDescription('');
    setShowAddForm(false);
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleEnroll = async (id) => {
    await enrollCourse(id);
    navigate(`/tasks/${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Momentummate.io</h1>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="stats-row">
        <div className="chart-section">
          <h2>Course Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="#1e293b" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <p className="stat-number">{tasks.length}</p>
          <p className="stat-label">Total Courses</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{completedLectures}</p>
          <p className="stat-label">Lectures Done</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{totalLectures - completedLectures}</p>
          <p className="stat-label">Lectures Left</p>
        </div>
      </div>

      <div className="section-header">
        <h2>All Courses</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="toggle-form-btn">
          {showAddForm ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTask} className="add-task-form">
          <input type="text" placeholder="Course title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Course description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button type="submit">Add</button>
        </form>
      )}

      <div className="course-grid">
        {tasks.map((task) => {
          const enrolled = isEnrolled(task);
          return (
            <div key={task._id} className="course-card">
              <h3>{task.title}</h3>
              <p className="course-desc">{task.description}</p>

              {enrolled ? (
                <>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${getProgress(task)}%` }}></div>
                  </div>
                  <p className="progress-text">{getProgress(task)}% complete</p>
                </>
              ) : (
                <p className="not-enrolled-text">Not enrolled yet</p>
              )}

              <div className="course-actions">
                {enrolled ? (
                  <button onClick={() => navigate(`/tasks/${task._id}`)} className="primary-btn">Continue</button>
                ) : (
                  <button onClick={() => handleEnroll(task._id)} className="primary-btn">Enroll</button>
                )}
                <button onClick={() => handleDelete(task._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;

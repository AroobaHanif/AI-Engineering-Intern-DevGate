import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTasks } from '../api/tasks';
import { getCurrentUserId } from '../utils/auth';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const currentUserId = getCurrentUserId();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        
        getTasks()
          .then((data) => {
            setTasks(data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }, []);

      const getCourseData = () => {
        return tasks.map((task) => {
          const total = task.lectures ? task.lectures.length : 0;
          const done = task.lectures
            ? task.lectures.filter((l) => l.completedBy && l.completedBy.includes(currentUserId)).length
            : 0;
          const percent = total === 0 ? 0 : Math.round((done / total) * 100);
          return { name: task.title, progress: percent };
        });
      };

      const totalLectures = tasks.reduce((sum, t) => sum + (t.lectures ? t.lectures.length : 0), 0);
      const completedLectures = tasks.reduce((sum, t) => {
        if (!t.lectures) return sum;
        return sum + t.lectures.filter((l) => l.completedBy && l.completedBy.includes(currentUserId)).length;
      }, 0);

      if (loading) return <p>Loading...</p>;

      return (
        <div className='dashboard'>
            <header className='dashboard-header'>
                <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="logout-btn">
                    Logout
                </button>
                <h1>Momentummate.io</h1>
                <Link to="/tasks" className='nav-link'>View All Tasks</Link>
            </header>

            <div className='stats-row'>
                <div className='chart-section'>
                    <h2>Course Progress</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={getCourseData()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis allowDecimals={false} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="progress" stroke="#1e293b" strokeWidth={3} dot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className='stat-card'>
                    <p className='stat-number'>{tasks.length}</p>
                    <p className='stat-label'>Total Courses</p>
                </div>
                <div className='stat-card'>
                    <p className='stat-number'>{completedLectures}</p>
                    <p className='stat-label'>Lectures Done</p>
                </div>
                <div className='stat-card'>
                    <p className='stat-number'>{totalLectures - completedLectures}</p>
                    <p className='stat-label'>Lectures Left</p>
                </div>
            </div>
        </div>
      );
}

export default Dashboard;
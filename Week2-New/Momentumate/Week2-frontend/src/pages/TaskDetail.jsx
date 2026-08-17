import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTask, deleteTask, enrollCourse, addLecture, toggleLecture } from '../api/tasks';

function getCurrentUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return JSON.parse(atob(token.split('.')[1])).userId;
}

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const currentUserId = getCurrentUserId();

  const loadTask = async () => {
    const data = await getTask(id);
    setTask(data);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    enrollCourse(id).finally(loadTask);
  }, [id]);

  const handleToggle = async (index) => {
    const updated = await toggleLecture(id, index);
    setTask(updated);
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    const updated = await addLecture(id, { title: linkTitle, link: linkUrl });
    setTask(updated);
    setLinkTitle('');
    setLinkUrl('');
    setShowAddForm(false);
  };

  const handleDelete = async () => {
    await deleteTask(id);
    navigate('/dashboard');
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{task.title}</h1>
        <Link to="/dashboard" className="nav-link">Back to Dashboard</Link>
      </header>

      <p className="course-desc">{task.description}</p>

      <div className="section-header">
        <h2>Course Links</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="toggle-form-btn">
          {showAddForm ? 'Cancel' : '+ Add Link'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddLink} className="add-task-form">
          <input type="text" placeholder="Title (e.g. Chapter 1)" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} required />
          <input type="url" placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required />
          <button type="submit">Add</button>
        </form>
      )}

      <div className="lecture-list">
        {task.lectures.length === 0 && <p className="not-enrolled-text">No links added yet.</p>}
        {task.lectures.map((lecture, index) => {
          const done = lecture.completedBy.includes(currentUserId);
          return (
            <div key={index} className={`lecture-row ${done ? 'lecture-done' : ''}`}>
              <a href={lecture.link} target="_blank" rel="noreferrer" className="lecture-link">
                {lecture.title} ↗
              </a>
              <label className="complete-checkbox">
                <input type="checkbox" checked={done} onChange={() => handleToggle(index)} />
                Mark Completed
              </label>
            </div>
          );
        })}
      </div>

      <button onClick={handleDelete} className="delete-btn" style={{ marginTop: '24px' }}>Delete Course</button>
    </div>
  );
}

export default TaskDetail;

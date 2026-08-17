import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { deleteTask, updateTask, toggleLecture } from '../api/tasks';
import { getYouTubeId } from '../utils/youtube';
import { getCurrentUserId } from '../utils/auth';

const API_URL = 'http://localhost:5000';

const LECTURES = [
  { title: 'FREE Amazon FBA Course', videoUrl: 'https://www.youtube.com/watch?v=LegZUuOVZ9Y' },
  { title: 'Machine Learning Algorithms Tutorial', videoUrl: 'https://www.youtube.com/watch?v=Pr5_Mf370xw' },
  { title: 'What is RAG? Explained in 15 Minutes', videoUrl: 'https://www.youtube.com/watch?v=Ty8gcCKuwNI' },
  { title: 'DSA Lecture 1: Flowchart & Pseudocode', videoUrl: 'https://www.youtube.com/watch?v=VTLCoHnyACE' },
];

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentUserId = getCurrentUserId();

  const loadTask = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
    let found = res.data.find((t) => t._id === id);

    if (found && (!found.lectures || found.lectures.length === 0)) {
      const initialLectures = LECTURES.map((l) => ({ ...l, completedBy: [] }));
      found = await updateTask(id, { lectures: initialLectures });
    }

    setTask(found);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    loadTask();
  }, [id]);

  const handleToggle = async (index) => {
    const updated = await toggleLecture(id, index);
    setTask(updated);
  };

  const handleDelete = async () => {
    await deleteTask(id);
    navigate('/tasks');
  };

  if (!task) return <p>Loading...</p>;

  const selectedLecture = selectedIndex !== null ? task.lectures[selectedIndex] : null;
  const videoId = selectedLecture ? getYouTubeId(selectedLecture.videoUrl) : null;
  const isCompletedByMe = selectedLecture ? selectedLecture.completedBy.includes(currentUserId) : false;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{task.title}</h1>
        <Link to="/tasks" className="nav-link">Back to Courses</Link>
      </header>

      <p className="course-desc">{task.description}</p>

      <div className="lecture-dropdown-wrapper">
        <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {selectedLecture ? selectedLecture.title : 'Select a Lecture'} {dropdownOpen ? '▲' : '▼'}
        </button>

        {dropdownOpen && (
          <div className="dropdown-list">
            {task.lectures.map((lecture, index) => (
              <div key={index} className="dropdown-item" onClick={() => { setSelectedIndex(index); setDropdownOpen(false); }}>
                <span>{lecture.title}</span>
                {lecture.completedBy.includes(currentUserId) && <span className="check-mark">✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {videoId && (
        <div className="video-section">
          <div className="video-wrapper">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={selectedLecture.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <a href={selectedLecture.videoUrl} target="_blank" rel="noreferrer" className="watch-youtube-link">
            Watch on YouTube ↗
          </a>

          <label className="complete-checkbox">
            <input type="checkbox" checked={isCompletedByMe} onChange={() => handleToggle(selectedIndex)} />
            Mark as Completed
          </label>
        </div>
      )}

      <button onClick={handleDelete} className="delete-btn" style={{ marginTop: '24px' }}>Delete Course</button>
    </div>
  );
}

export default TaskDetail;
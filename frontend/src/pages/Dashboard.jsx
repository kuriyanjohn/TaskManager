import { useEffect, useState,useCallback } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState('todo');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchTasks = useCallback(async () => {
    const res = await api.get('/tasks', {
      params: { search, status, page, limit: 8 },
    });

    setTasks(res.data.tasks);
    setPages(res.data.pagination.pages);
  },[]);

  useEffect(() => {
    fetchTasks();
  },[fetchTasks]);

  /* ---------- ACTIONS ---------- */

  const addTask = async () => {
    if (!title.trim()) return;
    await api.post('/tasks', { title });
    setTitle('');
    setPage(1);
    fetchTasks();
  };

  const startEdit = (task) => {
  setEditId(task._id);
  setEditTitle(task.title);
  setEditStatus(task.status);
};

  const saveEdit = async (id) => {
  if (!editTitle.trim()) return;

  await api.put(`/tasks/${id}`, {
    title: editTitle,
    status: editStatus
  });

  setEditId(null);
  setEditTitle('');
  setEditStatus('todo');
  fetchTasks();
};


  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  /* ---------- UI ---------- */

  return (
    <div className="app-container">
      <div className="dashboard">

        <div className="header">
          <h2>Task Manager</h2>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>

        {/* Add Task */}
        <div className="form">
          <div className="form-group">
            <input
              placeholder="New task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={addTask}>
            Add Task
          </button>
        </div>

        {/* Search & Filters */}
        <div className="filters">
          <input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Task List */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((task) => (
              <div className="task-card" key={task._id}>
                {editId === task._id ? (
  <>
    <input
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
    />

    <select
      value={editStatus}
      onChange={(e) => setEditStatus(e.target.value)}
    >
      <option value="todo">Todo</option>
      <option value="in-progress">In Progress</option>
      <option value="done">Done</option>
    </select>

    <div className="task-actions">
      <button
        className="btn btn-primary"
        onClick={() => saveEdit(task._id)}
      >
        Save
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => setEditId(null)}
      >
        Cancel
      </button>
    </div>
  </>
) : (

                  <>
                    <h3>{task.title}</h3>
<p className="task-meta">Status: {task.status}</p>
                    <div className="task-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => startEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span> Page {page} of {pages} </span>
          <button disabled={page === pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  // Add task
  const [title, setTitle] = useState('');

  // Edit task
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Search / filter / pagination
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchTasks = async () => {
    const res = await api.get('/tasks', {
      params: {
        search,
        status,
        page,
        limit: 5
      }
    });

    setTasks(res.data.tasks);
    setPages(res.data.pagination.pages);
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status, page]);

  /* ----------------- CRUD ACTIONS ----------------- */

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
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;

    await api.put(`/tasks/${id}`, { title: editTitle });
    setEditId(null);
    setEditTitle('');
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


  /* ----------------- UI ----------------- */

  return (
    <div>
      <h2>Task Manager</h2>
      <button onClick={logout} style={{ float: 'right' }}>
  Logout
</button>
      

      {/* 🔹 Add Task */}
      <div>
        <input
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <hr />

      {/* 🔹 Search & Filter */}
      <div>
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

      <hr />

      {/* 🔹 Task List */}
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} style={{ marginBottom: '8px' }}>
            {editId === task._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(task._id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{task.title}</strong> — {task.status}
                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}

      <hr />

      {/* 🔹 Pagination */}
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span> Page {page} of {pages} </span>

        <button disabled={page === pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

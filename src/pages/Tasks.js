import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TaskForm, { taskInitialForm } from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";

function Tasks({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(taskInitialForm);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setIsLoading(true);
      setError("");
      const data = await getTasks();
      setTasks(data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load tasks");
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError("");

      if (selectedTaskId) {
        const updated = await updateTask(selectedTaskId, formData);
        setTasks((current) =>
          current.map((task) => (task._id === selectedTaskId ? updated : task))
        );
      } else {
        const created = await createTask(formData);
        setTasks((current) => [created, ...current]);
      }

      resetForm();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to save task");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(task) {
    setSelectedTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
    });
    setError("");
  }

  async function handleDelete(id) {
    try {
      setIsDeletingId(id);
      setError("");
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
      if (selectedTaskId === id) resetForm();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to delete task");
    } finally {
      setIsDeletingId("");
    }
  }

  function resetForm() {
    setSelectedTaskId("");
    setFormData(taskInitialForm);
  }

  const pendingCount = tasks.filter((t) => t.status === "Pending").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;
  const isEditing = Boolean(selectedTaskId);

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />

      <div className="main-content">
        <div className="page-header">
          <h1>Tasks</h1>
          <p>Manage your personal tasks and track their progress.</p>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="label">Total Tasks</div>
            <div className="value">{tasks.length}</div>
            <div className="sub">All tasks</div>
          </div>
          <div className="stat-card">
            <div className="label">Pending</div>
            <div className="value">{pendingCount}</div>
            <div className="sub">Awaiting completion</div>
          </div>
          <div className="stat-card">
            <div className="label">Completed</div>
            <div className="value">{completedCount}</div>
            <div className="sub">Done tasks</div>
          </div>
        </div>

        <div className="search-bar">
          {["All", "Pending", "Completed"].map((status) => (
            <button
              key={status}
              className={`filter-btn${filterStatus === status ? " active" : ""}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {error && <div className="feedback-banner error">{error}</div>}
        {isLoading && <div className="feedback-banner">Loading tasks...</div>}

        <div className="employee-grid">
          <TaskForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />
          <TaskList
            tasks={tasks}
            filterStatus={filterStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeletingId={isDeletingId}
          />
        </div>
      </div>
    </div>
  );
}

export default Tasks;

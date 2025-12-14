import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../services/projectService';
import { createTask, toggleTask, deleteTask } from '../services/taskService';
import Navbar from '../components/Navbar';

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    
    // State for Inputs
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDesc, setNewTaskDesc] = useState("");
    const [newTaskDate, setNewTaskDate] = useState("");

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            const data = await getProjectById(id);
            setProject(data);
        } catch (error) {
            alert("Error loading project");
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle) return;

        try {
            await createTask(id, { 
                title: newTaskTitle, 
                description: newTaskDesc, 
                dueDate: newTaskDate || null
            });

            // Clear inputs
            setNewTaskTitle("");
            setNewTaskDesc("");
            setNewTaskDate("");
            loadProject(); 
        } catch (error) {
            alert("Failed to add task");
        }
    };

    const handleToggle = async (taskId) => {
        await toggleTask(taskId);
        loadProject();
    };

    const handleDelete = async (taskId) => {
        if(confirm("Delete this task?")) {
            await deleteTask(taskId);
            loadProject();
        }
    };

    if (!project) return <div>Loading...</div>;

    const formatDate = (dateString) => {
        if(!dateString) return "";
        // Using localedateString for a simple, localized format like "12/31/2023"
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="content">
                <Link to="/Dashboard" className="back-link">← Back to Dashboard</Link>
                
                <div className="header-section">
                    <h1>{project.title}</h1>
                    <p>{project.description}</p>
                </div>

                <div className="tasks-section">
                    <h3>Checklist</h3>
                    
                    {/* 1. SIMPLIFIED STACKED FORM */}
                    <form onSubmit={handleAddTask} className="simple-task-form">
                        <input 
                            type="text" 
                            placeholder="Task Title" 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            required
                            className="simple-input main-input"
                        />
                        <textarea 
                            placeholder="Description" 
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            className="simple-input"
                            rows="2"
                        />
                         <input 
                            type="date" 
                            value={newTaskDate}
                            onChange={(e) => setNewTaskDate(e.target.value)}
                            className="simple-input date-input"
                        />
                        <button type="submit" className="simple-add-btn">Add Task</button>
                    </form>

                    <div className="task-list">
                        {project.tasks.map(task => (
                            /* 2. RESTRUCTURED TASK ITEM */
                            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                
                                {/* LEFT SIDE: Checkbox + Title + Description */}
                                <div onClick={() => handleToggle(task.id)} className="task-left-side">
                                    <div className="custom-checkbox">
                                        {task.completed && "✔"}
                                    </div>
                                    <div className="task-text-content">
                                        <span className="task-title">{task.title}</span>
                                        {task.description && <p className="task-desc-preview">{task.description}</p>}
                                    </div>
                                </div>

                                {/* RIGHT SIDE: Date + Delete Button */}
                                <div className="task-right-side">
                                     {/* Date on the right, no icon */}
                                    {task.dueDate && <span className="task-date-right">{formatDate(task.dueDate)}</span>}
                                    <button onClick={() => handleDelete(task.id)} className="delete-icon">✕</button>
                                </div>

                            </div>
                        ))}
                        {project.tasks.length === 0 && <p className="empty-state">No tasks yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetails;
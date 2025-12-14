import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../services/projectService';
import { createTask, toggleTask, deleteTask } from '../services/taskService';
import Navbar from '../components/Navbar';

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState("");

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
            // Using a default due date for now (today)
            await createTask(id, { 
                title: newTaskTitle, 
                description: "", 
                dueDate: new Date().toISOString().split('T')[0] 
            });
            setNewTaskTitle("");
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

    // CALCULATE STATS
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.completed).length;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content">
                <Link to="/" className="back-link">← Back to Dashboard</Link>
                
                <div className="header-section">
                    <h1>{project.title}</h1>
                    <p>{project.description}</p>
                </div>

                {/* --- STATS CARDS SECTION --- */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Tasks</h3>
                        <p className="stat-number">{totalTasks}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed</h3>
                        <p className="stat-number">{completedTasks}</p>
                    </div>
                    <div className="stat-card progress-card">
                        <h3>Progress</h3>
                        <div className="progress-container">
                            <div className="progress-bar" style={{width: `${project.progressPercentage}%`}}></div>
                        </div>
                        <p>{project.progressPercentage}% Done</p>
                    </div>
                </div>

                <div className="tasks-section">
                    <h3>Checklist</h3>
                    
                    {/* Add Task Button & Input */}
                    <form onSubmit={handleAddTask} className="add-task-form">
                        <input 
                            type="text" 
                            placeholder="Add a new task..." 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <button type="submit" className="add-btn">+ Add</button>
                    </form>

                    {/* Task Checklist */}
                    <div className="task-list">
                        {project.tasks.map(task => (
                            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                <div onClick={() => handleToggle(task.id)} className="task-info">
                                    <div className="custom-checkbox">
                                        {task.completed && "✔"}
                                    </div>
                                    <span>{task.title}</span>
                                </div>
                                <button onClick={() => handleDelete(task.id)} className="delete-icon">✕</button>
                            </div>
                        ))}
                        {project.tasks.length === 0 && <p className="empty-state">No tasks yet. Add one above!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetails;
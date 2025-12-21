import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../services/projectService';
import { createTask, toggleTask, deleteTask } from '../services/taskService';
import Navbar from '../components/Navbar';

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    
    // Form States
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDesc, setNewTaskDesc] = useState("");
    const [newTaskDate, setNewTaskDate] = useState("");

    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

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
        return new Date(dateString).toLocaleDateString();
    };

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.completed).length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const filteredTasks = project.tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        let matchesStatus = true;
        if (statusFilter === "COMPLETED") matchesStatus = task.completed === true;
        if (statusFilter === "PENDING") matchesStatus = task.completed === false;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="page-container">
            <Navbar />
            <div className="content">
                {/* Back Link with Arrow Icon */}
                <Link to="/Dashboard" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', textDecoration: 'none', color: '#333' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Dashboard
                </Link>
                
                <div className="header-section" style={{ marginTop: '20px' }}>
                    <h1 style={{ fontSize: '2.5rem' }}>{project.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: '#555' }}>{project.description}</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Tasks</h3>
                        <p className="stat-number">{totalTasks}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed</h3>
                        <p className="stat-number">{completedTasks}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Progress</h3>
                        <p className="stat-number">{progress}%</p>
                    </div>
                </div>

                <div className="tasks-section">
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Checklist</h3>
                    
                    {/* --- ADD TASK FORM --- */}
                    <form onSubmit={handleAddTask} className="simple-task-form">
                        <input 
                            type="text" 
                            placeholder="Task Title" 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            required
                            className="simple-input main-input"
                            style={{ fontSize: '1.1rem', padding: '12px' }}
                        />
                        <textarea 
                            placeholder="Description (Optional)" 
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            className="simple-input"
                            rows="2"
                            style={{ fontSize: '1rem' }}
                        />
                         <input 
                            type="date" 
                            value={newTaskDate}
                            onChange={(e) => setNewTaskDate(e.target.value)}
                            className="simple-input date-input"
                            style={{ fontSize: '1rem' }}
                        />
                        {/* Add Button with Plus Icon */}
                        <button type="submit" className="simple-add-btn" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Task
                        </button>
                    </form>

                    {/* --- SEARCH & FILTER BAR --- */}
                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px', marginBottom: '20px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            {/* Search Icon */}
                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center'}}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search tasks..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '12px 12px 12px 40px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #ddd',
                                    fontSize: '1.1rem' 
                                }}
                            />
                        </div>
                        
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', cursor: 'pointer' }}
                        >
                            <option value="ALL">All Tasks</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    {/* --- TASK LIST --- */}
                    <div className="task-list">
                        {filteredTasks.map(task => (
                            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`} style={{ padding: '15px' }}>
                                <div onClick={() => handleToggle(task.id)} className="task-left-side" style={{ cursor: 'pointer' }}>
                                    
                                    {/* Checkbox with Check Icon */}
                                    <div className="custom-checkbox" style={{ 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        border: task.completed ? 'none' : '2px solid #ddd',
                                        backgroundColor: task.completed ? '#4caf50' : 'transparent',
                                        color: 'white', marginRight: '15px',
                                        transition: 'all 0.2s'
                                    }}>
                                        {task.completed && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        )}
                                    </div>

                                    <div className="task-text-content">
                                        <span className="task-title" style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                                            {task.title}
                                        </span>
                                        {task.description && (
                                            <p className="task-desc-preview" style={{ fontSize: '1rem', color: '#666' }}>
                                                {task.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="task-right-side" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    {task.dueDate && (
                                        <span className="task-date-right" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: '#888' }}>
                                            {/* Calendar Icon */}
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            {formatDate(task.dueDate)}
                                        </span>
                                    )}
                                    
                                    {/* Delete Button with Trash Icon */}
                                    <button 
                                        onClick={() => handleDelete(task.id)} 
                                        className="delete-icon"
                                        style={{ 
                                            background: 'none', border: 'none', 
                                            cursor: 'pointer', padding: '8px', 
                                            transition: 'transform 0.2s'
                                        }}
                                        title="Delete Task"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {filteredTasks.length === 0 && (
                            <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: '#888', fontSize: '1.1rem' }}>
                                {/* Empty List Icon */}
                                <div style={{ marginBottom: '10px' }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                </div>
                                <p>{project.tasks.length === 0 ? "No tasks yet. Add one above!" : "No tasks match your search."}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetails;
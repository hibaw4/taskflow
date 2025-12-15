import { useEffect, useState } from 'react';
import { getAllProjects, createProject, deleteProject} from '../services/projectService';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await getAllProjects();
            setProjects(data || []);
        } catch (error) {
            alert("Failed to load projects!");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createProject({ title: newTitle, description: newDesc });
            setNewTitle("");
            setNewDesc("");
            setShowForm(false); // Hide form after success
            loadProjects();     // Refresh list
        } catch (error) {
            alert("Error creating project");
        }
    };

    const handleDeleteProject = async (id) => {
        if (confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteProject(id);
                loadProjects(); // Reload the list immediately
            } catch (error) {
                alert("Failed to delete project");
            }
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="content">
                <div className="dashboard-header">
                    <h1>My Projects</h1>
                    <button className="create-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "✖ Close" : "+ Create New Project"}
                    </button>
                </div>

                {/* Create project form */}
                {showForm && (
                    <form onSubmit={handleCreate} className="create-project-form">
                        <input 
                            type="text" 
                            placeholder="Project Title" 
                            value={newTitle} 
                            onChange={(e) => setNewTitle(e.target.value)} 
                            required
                        />
                        <textarea 
                            placeholder="Description" 
                            value={newDesc} 
                            onChange={(e) => setNewDesc(e.target.value)} 
                        />
                        <button type="submit">Save Project</button>
                    </form>
                )}

                <div className="project-grid">
                    {(projects).map((project) => (
                        <ProjectCard key={project.id} project={project} onDelete={handleDeleteProject}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
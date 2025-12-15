import { useNavigate } from 'react-router-dom';

function ProjectCard({ project, onDelete}) {
    const navigate = useNavigate();

    return (
        <div className="project-card" style={{ position: 'relative' }}>
            <button 
                className="delete-project-btn"
                onClick={(e) => {
                    e.stopPropagation(); // To prevent accidental clicks
                    onDelete(project.id);
                }}
                title="Delete Project"
            >
                ✕
            </button>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            
            <div className="progress-container">
                <div 
                    className="progress-bar" 
                    style={{ width: `${project.progressPercentage}%` }}
                ></div>
            </div>
            <p className="progress-text">{project.progressPercentage}% Complete</p>

            <button onClick={() => navigate(`/project/${project.id}`)}>
                View Tasks
            </button>
        </div>
    );
}

export default ProjectCard;
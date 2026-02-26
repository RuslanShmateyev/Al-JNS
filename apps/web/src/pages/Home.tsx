import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RoadmapResponseDto } from '@al-jns/contracts';
import { CreateRoadmapModal } from '../components/CreateRoadmapModal';
import './Home.css';

export function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roadmaps, setRoadmaps] = useState<RoadmapResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const response = await fetch('http://localhost:3333/roadmap', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setRoadmaps(data);
            } catch (error) {
                console.error('Error fetching roadmaps:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoadmaps();
    }, []);

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to Al-JNS</h1>
                <p>The ultimate AI-powered roadmap generator for your learning journey.</p>
                <button
                    className="create-roadmap-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Roadmap
                </button>
            </div>

            <div className="roadmaps-section">
                <h2>Your Roadmaps</h2>
                {isLoading ? (
                    <div className="loading-spinner">Loading roadmaps...</div>
                ) : roadmaps.length > 0 ? (
                    <div className="roadmaps-grid">
                        {roadmaps.map((roadmap) => (
                            <div key={roadmap.id} className="roadmap-card">
                                <h3>{roadmap.title}</h3>
                                <div className="progress-container">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${roadmap.progress}%` }}
                                    ></div>
                                    <span className="progress-text">{Math.round(roadmap.progress)}%</span>
                                </div>
                                <Link to={`/flow/${roadmap.id}`} className="open-roadmap-link">
                                    Open Roadmap
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-roadmaps">No roadmaps found. Create one to get started!</p>
                )}
            </div>

            <CreateRoadmapModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

import { useState } from 'react';
import { CreateRoadmapModal } from '../components/CreateRoadmapModal';
import './Home.css';

export function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            <div className="features-grid">
            </div>

            <CreateRoadmapModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

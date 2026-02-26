import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetInterestsDto, GetProjectsDto, GenerateRoadmapDto } from '@al-jns/contracts';
import './CreateRoadmapModal.css';

interface CreateRoadmapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateRoadmapModal({ isOpen, onClose }: CreateRoadmapModalProps) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form state
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState('Beginner');
    const [interests, setInterests] = useState<string[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [projectAdvice, setProjectAdvice] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState('');

    if (!isOpen) return null;

    const fetchInterests = async () => {
        setLoading(true);
        try {
            const body: GetInterestsDto = { topic, level };
            const response = await fetch('http://localhost:3333/roadmap/interests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            setInterests(data);
            setStep(2);
        } catch (error) {
            console.error('Error fetching interests:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectAdvice = async () => {
        setLoading(true);
        try {
            const body: GetProjectsDto = { topic, level, interests: selectedInterests };
            const response = await fetch('http://localhost:3333/roadmap/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            setProjectAdvice(data);
            setStep(3);
        } catch (error) {
            console.error('Error fetching project advice:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateRoadmap = async () => {
        setLoading(true);
        try {
            const body: GenerateRoadmapDto = {
                topic,
                level,
                interests: selectedInterests,
                project: selectedProject
            };
            const response = await fetch('http://localhost:3333/roadmap/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            onClose();
            navigate(`/flow/${data.id}`);
        } catch (error) {
            console.error('Error generating roadmap:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {loading ? (
                    <div className="loader">
                        <div className="spinner"></div>
                        <p>{step === 3 ? "Generating your custom roadmap..." : "Thinking..."}</p>
                    </div>
                ) : (
                    <>
                        {step === 1 && (
                            <div className="step-content">
                                <h2>Build Your Path</h2>
                                <div className="form-group">
                                    <label>What do you want to learn?</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. React, Python, UI Design"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Current level</label>
                                    <div className="level-selector">
                                        {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                                            <button
                                                key={l}
                                                className={`level-btn ${level === l ? 'active' : ''}`}
                                                onClick={() => setLevel(l)}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                                    <button className="btn-primary" onClick={fetchInterests} disabled={!topic}>Next</button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="step-content">
                                <h2>Tell us your interests</h2>
                                <p>Pick sub-topics that interest you most:</p>
                                <div className="interests-list">
                                    {interests.map(i => (
                                        <div
                                            key={i}
                                            className={`interest-item ${selectedInterests.includes(i) ? 'selected' : ''}`}
                                            onClick={() => toggleInterest(i)}
                                        >
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                                    <button className="btn-primary" onClick={fetchProjectAdvice} disabled={selectedInterests.length === 0}>Next</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="step-content">
                                <h2>Project Idea</h2>
                                <p>Choose a project to build along the way:</p>
                                <div className="project-advice-list">
                                    {projectAdvice.map(p => (
                                        <div
                                            key={p}
                                            className={`advice-item ${selectedProject === p ? 'selected' : ''}`}
                                            onClick={() => setSelectedProject(p)}
                                        >
                                            {p}
                                        </div>
                                    ))}
                                </div>
                                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                    <label>Or define your own project</label>
                                    <textarea
                                        placeholder="I want to build a..."
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
                                    <button className="btn-primary" onClick={generateRoadmap} disabled={!selectedProject}>Create Roadmap</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

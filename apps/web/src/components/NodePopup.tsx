import type { Node } from '@xyflow/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from '@mui/material/Tooltip';
import { CompleteNodeDto } from '@al-jns/contracts';
import './NodePopup.css';

interface NodePopupProps {
    node: Node | null;
    roadmapId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function NodePopup({ node, roadmapId, isOpen, onClose }: NodePopupProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
    const [notificationDelay, setNotificationDelay] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Reset search when popup opens/closes or node changes, and focus input
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setIsNotificationPopupOpen(false);
            setNotificationDelay('');
        } else {
            // Focus input when opened
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen, node]);

    const title = node?.data?.label as string || 'Node Properties';
    const description = node?.data?.description as string || '';

    const showDescription = useMemo(() => {
        if (!searchQuery) return true;
        return description.toLowerCase().includes(searchQuery.toLowerCase());
    }, [description, searchQuery]);

    const tasks = useMemo(() => {
        return (node?.data?.tasks as any[]) || [];
    }, [node]);

    const filteredTasks = useMemo(() => {
        if (!searchQuery) return tasks;
        const query = searchQuery.toLowerCase();
        return tasks.filter(task =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query)
        );
    }, [tasks, searchQuery]);

    const hasAnyResults = showDescription || filteredTasks.length > 0;

    const handleComplete = async () => {
        if (!node) return;
        try {
            console.log(`Sending Complete request for node ${node.id}...`);
            const body: CompleteNodeDto = {
                id: roadmapId,
                nodeName: node.id // In FlowPage, node.id is node.title
            };

            const response = await fetch(import.meta.env.VITE_API_URL + "/roadmap/completeNode" || 'http://localhost:3333/roadmap/completeNode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Failed to complete node');
            }

            // alert(`Node ${node.id} completed successfully!`);
            onClose();
            // Optional: refresh page or state to show green node
            window.location.reload();
        } catch (error) {
            console.error('Failed to complete node', error);
            alert('Failed to complete node. Please try again.');
        }
    };

    const handleSetNotificationSubmit = async () => {
        if (!notificationDelay || isNaN(Number(notificationDelay))) {
            alert('Please enter a valid number of hours.');
            return;
        }
        try {
            console.log(`Sending Notification request for node ${node?.id} with delay ${notificationDelay}h...`);
            // Mock backend request
            await new Promise(resolve => setTimeout(resolve, 500));
            // alert(`Notification set for node ${node?.id} in ${notificationDelay} hours!`);
            setIsNotificationPopupOpen(false);
            setNotificationDelay('');
        } catch (error) {
            console.error('Failed to set notification', error);
        }
    };

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) {
            return <span>{text}</span>;
        }

        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);

        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <mark key={i} className="highlighted-text">{part}</mark>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </span>
        );
    };

    if (!node && !isOpen) return null;

    return (
        <div className={`node-popup-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div
                className={`node-popup-panel ${isOpen ? 'open' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="node-popup-toolbar">
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search in node..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="popup-search-input"
                    />
                    <div className="node-popup-actions">
                        <Tooltip title="Complete" placement="top">
                            <button className="action-btn complete-btn" onClick={handleComplete}>
                                <CheckIcon />
                            </button>
                        </Tooltip>
                        <Tooltip title="Set Notification" placement="top">
                            <button className="action-btn notify-btn" onClick={() => setIsNotificationPopupOpen(true)}>
                                <NotificationsIcon />
                            </button>
                        </Tooltip>
                    </div>
                </div>

                <div className="node-popup-header">
                    <h2>{title}</h2>
                </div>

                <div className="node-popup-content">
                    {node ? (
                        <>
                            {description && showDescription && (
                                <div className="property-group">
                                    <label>Description</label>
                                    <span>{highlightText(description, searchQuery)}</span>
                                </div>
                            )}

                            {filteredTasks.length > 0 && (
                                <div className="tasks-section">
                                    <h3>Tasks</h3>
                                    {filteredTasks.map((task, index) => (
                                        <div key={index} className="task-item">
                                            <div className="task-header">
                                                <span className="task-title">{highlightText(task.title, searchQuery)}</span>
                                                <span className={`task-difficulty difficulty-${task.difficulty}`}>
                                                    Level {task.difficulty}
                                                </span>
                                            </div>
                                            <p className="task-description">{highlightText(task.description, searchQuery)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {searchQuery && !hasAnyResults && (
                                <p className="no-results-text">No matches found for "{searchQuery}"</p>
                            )}
                        </>
                    ) : (
                        <p>No node selected.</p>
                    )}
                </div>

                {isNotificationPopupOpen && (
                    <div className="notification-popup-overlay" onClick={() => setIsNotificationPopupOpen(false)}>
                        <div className="notification-popup-panel" onClick={(e) => e.stopPropagation()}>
                            <h3>Set Notification Delay</h3>
                            <div className="notification-input-group">
                                <label>Delay (in hours):</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="e.g. 24"
                                    value={notificationDelay}
                                    onChange={(e) => setNotificationDelay(e.target.value)}
                                />
                            </div>
                            <div className="notification-actions">
                                <button className="cancel-btn" onClick={() => setIsNotificationPopupOpen(false)}>Cancel</button>
                                <button className="submit-btn" onClick={handleSetNotificationSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

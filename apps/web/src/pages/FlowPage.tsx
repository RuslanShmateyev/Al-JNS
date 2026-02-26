import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    MarkerType,
    type Node,
    type Edge,
    type Connection,
} from '@xyflow/react';
import { RoadmapResponseDto, } from '@al-jns/contracts';
import type { RoadmapNode } from '@al-jns/contracts';
import { NodePopup } from '../components/NodePopup';
import api from '../utils/api';
import '@xyflow/react/dist/style.css';
import './FlowPage.css';

export function FlowPage() {
    const { id } = useParams<{ id: string }>();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [title, setTitle] = useState('Loading Roadmap...');

    // State for popup
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchRoadmap = async () => {
            try {
                const response = await api.get<RoadmapResponseDto>(`/roadmap/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = response.data;
                setTitle(data.title);

                const rawNodes: RoadmapNode[] = JSON.parse(data.nodes);

                // Transform to React Flow nodes and edges
                const { nodes: flowNodes, edges: flowEdges } = cleanNodesAndEdges(rawNodes);

                setNodes(flowNodes);
                setEdges(flowEdges);
            } catch (error) {
                console.error('Error fetching roadmap:', error);
                setTitle('Roadmap Not Found');
            }
        };

        fetchRoadmap();
    }, [id, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
        setIsPopupOpen(true);
    }, []);

    const closePopup = useCallback(() => {
        setIsPopupOpen(false);
    }, []);

    return (
        <div className="flow-container">
            <div className="flow-header" style={{ padding: '1rem' }}>
                <h1>{title}</h1>
            </div>
            <div className="flow-wrapper">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeDoubleClick={onNodeDoubleClick}
                    defaultEdgeOptions={{
                        markerEnd: { type: MarkerType.Arrow },
                        style: { strokeWidth: 1.5 },
                        interactionWidth: 0,
                    }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    edgesFocusable={false}
                    zoomOnDoubleClick={false}
                    elementsSelectable={true}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>

                <NodePopup
                    node={selectedNode}
                    roadmapId={id || ''}
                    isOpen={isPopupOpen}
                    onClose={closePopup}
                />
            </div>
        </div>
    );
}

function cleanNodesAndEdges(roadmapNodes: RoadmapNode[]): { nodes: Node[], edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let currentY = 0;
    const spacing = 80;

    roadmapNodes.forEach((node, index) => {
        const titleCharsPerLine = 15;
        const titleLines = Math.ceil((node.title?.length || 0) / titleCharsPerLine);

        const nodeHeight = (titleLines * 25);

        if (roadmapNodes[index - 1] && roadmapNodes[index - 1].status === 'completed' && !node.status) {
            node.status = 'inAction';
        }

        console.log(index);
        console.log(roadmapNodes[index - 1]);
        console.log(node);

        nodes.push({
            id: node.title,
            position: { x: 100, y: currentY },
            data: {
                label: node.title,
                description: node.description,
                tasks: node.tasks,
                history: node.history,
                difficulty: node.difficulty,
                output: roadmapNodes[index + 1] ? true : false,
                input: index === 0 ? true : false
            },
            className: getClassByNodeStatus(node.status)
        });

        if (roadmapNodes[index + 1]) {
            edges.push({
                id: `e-${node.title}-${node.toNode}`,
                source: node.title,
                target: roadmapNodes[index + 1].title,
                markerEnd: { type: MarkerType.Arrow },
                style: { strokeWidth: 1.5 }
            });
        }

        currentY += nodeHeight + spacing;
    });

    return { nodes, edges };
}

function getClassByNodeStatus(status: string | undefined) {
    switch (status) {
        case 'inAction':
            return 'custom-node-in-action';
        case 'completed':
            return 'custom-node-completed';
        case 'failed':
            return 'custom-node-failed';
        default:
            return 'custom-node-default';
    }
}
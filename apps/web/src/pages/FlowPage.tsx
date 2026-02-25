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
import { RoadmapResponseDto } from '@al-jns/contracts';
import { NodePopup } from '../components/NodePopup';
import '@xyflow/react/dist/style.css';
import './FlowPage.css';

interface RoadmapNode {
    title: string;
    difficulty: number;
    toNode: string;
    description: string;
    tasks: any[];
    history: string;
}

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
                const response = await fetch(`http://localhost:3333/roadmap/${id}`);
                const data: RoadmapResponseDto = await response.json();
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
                    nodesDraggable={true}
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

    roadmapNodes.forEach((node, index) => {
        nodes.push({
            id: node.title,
            position: { x: 100, y: index * 120 },
            data: {
                label: node.title,
                description: node.description,
                tasks: node.tasks,
                history: node.history,
                difficulty: node.difficulty
            },
            className: `custom-node custom-node-default nopan`
        });

        if (node.toNode && node.toNode !== "null") {
            edges.push({
                id: `e-${node.title}-${node.toNode}`,
                source: node.title,
                target: node.toNode,
                markerEnd: { type: MarkerType.Arrow },
                style: { strokeWidth: 1.5 }
            });
        }
    });

    return { nodes, edges };
}
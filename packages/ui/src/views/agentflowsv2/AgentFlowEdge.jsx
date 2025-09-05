import { EdgeLabelRenderer, getSmoothStepPath } from 'reactflow'
import { memo, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { SET_DIRTY } from '@/store/actions'
import { flowContext } from '@/store/context/ReactFlowContext'
import { IconX } from '@tabler/icons-react'
import { useTheme } from '@mui/material/styles'

function EdgeLabel({ transform, isHumanInput, label, color }) {
    return (
        <div
            style={{
                position: 'absolute',
                background: 'transparent',
                left: isHumanInput ? 10 : 0,
                paddingTop: 1,
                color: color,
                fontSize: '0.5rem',
                fontWeight: 700,
                transform,
                zIndex: 1000
            }}
            className='nodrag nopan'
        >
            {label}
        </div>
    )
}

EdgeLabel.propTypes = {
    transform: PropTypes.string,
    isHumanInput: PropTypes.bool,
    label: PropTypes.string,
    color: PropTypes.string
}

const foreignObjectSize = 40

const AgentFlowEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd, selected }) => {
    const [isHovered, setIsHovered] = useState(false)
    const { deleteEdge } = useContext(flowContext)
    const dispatch = useDispatch()
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    
    // Get appropriate color based on theme
    const getEdgeColor = () => {
        return customization.isDarkMode ? '#ffffff' : '#999999' // Even lighter black for light mode
    }

    const onEdgeClick = (evt, id) => {
        evt.stopPropagation()
        deleteEdge(id)
        dispatch({ type: SET_DIRTY })
    }

    const xEqual = sourceX === targetX
    const yEqual = sourceY === targetY

    const [edgePath, edgeCenterX, edgeCenterY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 0 // This creates sharp right-angle corners instead of rounded corners
    })

    const edgeColor = getEdgeColor()
    const gradientId = `edge-gradient-${id}`
    const animatedGradientId = `edge-animated-gradient-${id}`
    
    return (
        <>
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.6; }
                        50% { opacity: 1; }
                    }
                    
                    @keyframes flow {
                        0% { stroke-dashoffset: 12; }
                        100% { stroke-dashoffset: 0; }
                    }
                    
                    @keyframes flowSlow {
                        0% { stroke-dashoffset: 12; }
                        100% { stroke-dashoffset: 0; }
                    }
                    
                    .agent-flow-edge-base {
                        stroke-dasharray: 8, 4;
                        animation: flowSlow 1.5s linear infinite;
                    }
                    
                    .agent-flow-edge-animated {
                        stroke-dasharray: 5, 5;
                        animation: flow 1s linear infinite;
                    }
                `}
            </style>
            <defs>
                {/* Static gradient for base line */}
                <linearGradient id={gradientId}>
                    <stop offset='0%' stopColor={edgeColor} />
                    <stop offset='100%' stopColor={edgeColor} />
                </linearGradient>
                
                {/* Animated gradient for moving effect */}
                <linearGradient id={animatedGradientId}>
                    <stop offset='0%' stopColor={edgeColor} stopOpacity='0.3' />
                    <stop offset='50%' stopColor={edgeColor} stopOpacity='1' />
                    <stop offset='100%' stopColor={edgeColor} stopOpacity='0.3' />
                    <animateTransform
                        attributeName='gradientTransform'
                        type='translate'
                        values='-100 0; 100 0; -100 0'
                        dur='2s'
                        repeatCount='indefinite'
                    />
                </linearGradient>
            </defs>
            
            {/* Invisible selector path for hover detection */}
            <path
                id={`${id}-selector`}
                className='agent-flow-edge-selector'
                style={{
                    stroke: 'transparent',
                    strokeWidth: 20,
                    fill: 'none',
                    cursor: 'pointer'
                }}
                d={edgePath}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
            
            {/* Base edge line with moving dashes */}
            <path
                id={`${id}-base`}
                className='agent-flow-edge-base'
                style={{
                    strokeWidth: selected ? 2 : 1.5,
                    stroke: edgeColor,
                    filter: selected ? `drop-shadow(0 0 6px ${edgeColor}40)` : 'none',
                    cursor: 'pointer',
                    opacity: selected ? 1 : 0.8,
                    fill: 'none',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeDasharray: '8,4',
                    strokeDashoffset: '0',
                    animation: 'flow 1.5s linear infinite'
                }}
                d={edgePath}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
            
            {/* Animated overlay for moving dash effect */}
            <path
                id={`${id}-animated`}
                className='agent-flow-edge-animated'
                style={{
                    strokeWidth: selected ? 1 : 0.8,
                    stroke: edgeColor,
                    cursor: 'pointer',
                    opacity: selected ? 0.8 : 0.6,
                    fill: 'none',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeDasharray: '5,5',
                    strokeDashoffset: '0',
                    animation: 'flow 1s linear infinite'
                }}
                d={edgePath}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
            {data?.edgeLabel && (
                <EdgeLabelRenderer>
                    <EdgeLabel
                        isHumanInput={data?.isHumanInput}
                        color={edgeColor}
                        label={data.edgeLabel}
                        transform={`translate(-50%, 0%) translate(${sourceX}px,${sourceY}px)`}
                    />
                </EdgeLabelRenderer>
            )}
            {isHovered && (
                <foreignObject
                    width={foreignObjectSize}
                    height={foreignObjectSize}
                    x={edgeCenterX - foreignObjectSize / 2}
                    y={edgeCenterY - foreignObjectSize / 2}
                    className='edgebutton-foreignobject'
                    requiredExtensions='http://www.w3.org/1999/xhtml'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            pointerEvents: 'all'
                        }}
                    >
                        <button
                            className='edgebutton'
                            onClick={(event) => onEdgeClick(event, id)}
                            style={{
                                width: '16px',
                                height: '16px',
                                background: edgeColor,
                                border: `2px solid ${customization.isDarkMode ? '#000000' : '#ffffff'}`,
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: customization.isDarkMode ? '#000000' : '#ffffff',
                                boxShadow: `0 0 8px ${edgeColor}60`,
                                transition: 'all 0.2s ease-in-out',
                                padding: '2px'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.3)'
                                e.currentTarget.style.boxShadow = `0 0 12px ${edgeColor}80`
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.transform = 'scale(1.3)'
                                e.currentTarget.style.boxShadow = `0 0 12px ${edgeColor}80`
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = `0 0 8px ${edgeColor}60`
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = `0 0 8px ${edgeColor}60`
                            }}
                        >
                            <IconX stroke={2} size='12' color={customization.isDarkMode ? '#000000' : '#ffffff'} />
                        </button>
                    </div>
                </foreignObject>
            )}
        </>
    )
}

AgentFlowEdge.propTypes = {
    id: PropTypes.string,
    sourceX: PropTypes.number,
    sourceY: PropTypes.number,
    targetX: PropTypes.number,
    targetY: PropTypes.number,
    sourcePosition: PropTypes.any,
    targetPosition: PropTypes.any,
    style: PropTypes.object,
    data: PropTypes.object,
    markerEnd: PropTypes.any,
    selected: PropTypes.bool
}

export default memo(AgentFlowEdge)

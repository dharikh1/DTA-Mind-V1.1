import { memo } from 'react'
import { EdgeLabelRenderer, useStore, getSmoothStepPath } from 'reactflow'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { AGENTFLOW_ICONS } from '@/store/constant'
import { useTheme } from '@mui/material/styles'

function EdgeLabel({ transform, isHumanInput, label, color }) {
    return (
        <div
            style={{
                position: 'absolute',
                background: 'transparent',
                left: isHumanInput ? 20 : 10,
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

const ConnectionLine = ({ fromX, fromY, toX, toY, fromPosition, toPosition }) => {
    const [edgePath] = getSmoothStepPath({
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition,
        borderRadius: 0 // This creates sharp right-angle corners instead of rounded corners
    })

    const { connectionHandleId } = useStore()
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const nodeName = (connectionHandleId || '').split('_')[0] || ''

    const isLabelVisible = nodeName === 'humanInputAgentflow' || nodeName === 'conditionAgentflow' || nodeName === 'conditionAgentAgentflow'

    const getEdgeLabel = () => {
        let edgeLabel = undefined
        if (nodeName === 'conditionAgentflow' || nodeName === 'conditionAgentAgentflow') {
            const _edgeLabel = connectionHandleId.split('-').pop()
            edgeLabel = (isNaN(_edgeLabel) ? 0 : _edgeLabel).toString()
        }
        if (nodeName === 'humanInputAgentflow') {
            const _edgeLabel = connectionHandleId.split('-').pop()
            edgeLabel = (isNaN(_edgeLabel) ? 0 : _edgeLabel).toString()
            edgeLabel = edgeLabel === '0' ? 'proceed' : 'reject'
        }
        return edgeLabel
    }

    // Get appropriate color based on theme
    const getConnectionLineColor = () => {
        return customization.isDarkMode ? '#ffffff' : '#000000'
    }
    
    const color = getConnectionLineColor()

    return (
        <g>
            <defs>
                {/* Arrow marker for connection line */}
                <marker
                    id={`connection-arrow-${fromX}-${fromY}`}
                    markerWidth='8'
                    markerHeight='8'
                    refX='7'
                    refY='3'
                    orient='auto'
                    markerUnits='strokeWidth'
                >
                    <path
                        d='M0,0 L0,6 L7,3 z'
                        fill={color}
                        stroke={color}
                        strokeWidth='1'
                    />
                </marker>
            </defs>
            
            {/* Main connection line */}
            <path 
                fill='none' 
                stroke={color} 
                strokeWidth={2} 
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeDasharray='5,5'
                strokeDashoffset='0'
                d={edgePath}
                markerEnd={`url(#connection-arrow-${fromX}-${fromY})`}
                style={{
                    animation: 'connectionFlow 1s linear infinite'
                }}
            />
            
            {/* Animated overlay */}
            <path 
                fill='none' 
                stroke={color} 
                strokeWidth={1} 
                strokeLinecap='round'
                strokeLinejoin='round'
                opacity='0.6'
                d={edgePath}
                style={{
                    animation: 'connectionPulse 2s ease-in-out infinite'
                }}
            />
            
            <style>
                {`
                    @keyframes connectionFlow {
                        0% { stroke-dashoffset: 10; }
                        100% { stroke-dashoffset: 0; }
                    }
                    
                    @keyframes connectionPulse {
                        0%, 100% { opacity: 0.6; }
                        50% { opacity: 1; }
                    }
                `}
            </style>
            {isLabelVisible && (
                <EdgeLabelRenderer>
                    <EdgeLabel
                        color={color}
                        isHumanInput={nodeName === 'humanInputAgentflow'}
                        label={getEdgeLabel()}
                        transform={`translate(-50%, 0%) translate(${fromX}px,${fromY}px)`}
                    />
                </EdgeLabelRenderer>
            )}
        </g>
    )
}

ConnectionLine.propTypes = {
    fromX: PropTypes.number,
    fromY: PropTypes.number,
    toX: PropTypes.number,
    toY: PropTypes.number,
    fromPosition: PropTypes.any,
    toPosition: PropTypes.any
}

export default memo(ConnectionLine)

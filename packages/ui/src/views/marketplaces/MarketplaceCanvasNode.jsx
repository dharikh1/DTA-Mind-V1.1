// MarketplaceCanvasNode - Updated with enhanced condition detection (v2.0)
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Handle, Position } from 'reactflow'

// material-ui
import { styled, useTheme, alpha } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'

// const
import { baseURL, AGENTFLOW_ICONS } from '@/store/constant'

const CardWrapper = styled(MainCard, {
    shouldForwardProp: (prop) => prop !== 'isAgent'
})(({ theme, isAgent }) => ({
    background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    border: 'solid 2px',
    width: isAgent ? '140px' : '120px',
    height: isAgent ? '80px' : '120px',
    padding: '0',
    borderRadius: isAgent ? '12px' : '50%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
}))

// ===========================|| CANVAS NODE ||=========================== //

const MarketplaceCanvasNode = ({ data }) => {
    const theme = useTheme()

    const defaultColor = '#666666' // fallback color if data.color is not present
    
    // Get consistent node color based on label (same as AgentFlowNode)
    const getNodeColor = (nodeLabel) => {
        const label = nodeLabel.toLowerCase()
        
        if (label.includes('agent')) {
            return '#8B5CF6' // Purple
        } else if (label.includes('api') || label.includes('webhook')) {
            return '#3B82F6' // Blue
        } else if (label.includes('condition') || label.includes('if')) {
            return '#F59E0B' // Orange
        } else if (label.includes('function') || label.includes('custom')) {
            return '#EF4444' // Red
        } else if (label.includes('knowledge') || label.includes('vector') || label.includes('document')) {
            return '#06B6D4' // Teal
        } else if (label.includes('memory')) {
            return '#EC4899' // Pink
        } else if (label.includes('response') || label.includes('reply') || label.includes('output')) {
            return '#3B82F6' // Blue
        } else if (label.includes('router') || label.includes('switch')) {
            return '#10B981' // Green
        } else if (label.includes('execute') || label.includes('flow')) {
            return '#10B981' // Green
        } else if (label.includes('http')) {
            return '#EF4444' // Red
        } else if (label.includes('human') || label.includes('input')) {
            return '#8B5CF6' // Purple
        } else if (label.includes('llm') || label.includes('ai') || label.includes('chat')) {
            return '#3B82F6' // Blue
        } else if (label.includes('retriever') || label.includes('search')) {
            return '#6B7280' // Gray
        } else if (label.includes('start') || label.includes('begin')) {
            return '#10B981' // Green
        } else if (label.includes('iteration') || label.includes('loop') || label.includes('repeat')) {
            return '#F59E0B' // Orange
        } else if (label.includes('tool') || (data.name && data.name.toLowerCase().includes('tool'))) {
            return '#8B5CF6' // Purple
        }
        
        return data.color || defaultColor
    }
    
    const nodeColor = getNodeColor(data.label)
    
    // Check if this is an Agent or Condition node (enhanced detection)
    const isAgent = data.label && (
        data.label.toLowerCase().includes('agent') || 
        data.label.toLowerCase().includes('condition') ||
        data.label.toLowerCase().includes('check') ||
        data.label.toLowerCase().includes('if') ||
        data.label.toLowerCase().includes('valid') ||
        data.label.toLowerCase().includes('relevant')
    )

    const getOutputAnchors = () => {
        return data.outputAnchors ?? []
    }

    const getAnchorPosition = (index) => {
        const outputCount = getOutputAnchors().length
        const nodeHeight = isAgent ? 80 : 120 // Different heights for agent/condition vs other nodes
        
        if (outputCount === 1) {
            // Single output handle - center it
            return nodeHeight / 2 - 6 // 6 is half the handle height (12px)
        } else if (outputCount === 2) {
            // Two output handles - position them symmetrically around center
            const centerY = nodeHeight / 2
            const offset = 20 // Distance from center
            return index === 0 ? centerY - offset - 6 : centerY + offset - 6
        } else {
            // Multiple handles - distribute them evenly in a compact area around center
            const centerY = nodeHeight / 2
            const totalSpacing = Math.min(outputCount * 16, 60) // Max 60px total spacing
            const startY = centerY - (totalSpacing / 2)
            const spacing = outputCount > 1 ? totalSpacing / (outputCount - 1) : 0
            return startY + (spacing * index) - 6
        }
    }

    return (
        <>
            <CardWrapper
                content={false}
                isAgent={isAgent}
                sx={{
                    padding: 0,
                    borderColor: nodeColor,
                    backgroundColor: alpha(nodeColor, 0.1),
                    // Force rectangular shape for agent/condition nodes
                    width: isAgent ? '140px !important' : '120px !important',
                    height: isAgent ? '80px !important' : '120px !important',
                    borderRadius: isAgent ? '12px !important' : '50% !important'
                }}
                border={false}
            >
                {/* Input Handle */}
                <Handle
                    type='target'
                    position={Position.Left}
                    id={data.id}
                    style={{
                        width: 12,
                        height: 12,
                        backgroundColor: nodeColor,
                        position: 'absolute',
                        left: -6,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderRadius: '2px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out'
                    }}
                />

                {/* Node Content */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        padding: 1
                    }}
                >
                    {/* Icon Container */}
                    <Box
                        sx={{
                            width: isAgent ? 50 : 60,
                            height: isAgent ? 50 : 60,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 0.5
                        }}
                    >
                        <img
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                            src={`${baseURL}/api/v1/node-icon/${data.name}`}
                            alt={data.label}
                        />
                    </Box>

                    {/* Node Label */}
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textAlign: 'center',
                            color: theme.palette.text.primary,
                            lineHeight: 1.2,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {data.label}
                    </Typography>
                </Box>

                {/* Output Handles */}
                {getOutputAnchors().map((outputAnchor, index) => (
                    <Handle
                        type='source'
                        position={Position.Right}
                        key={outputAnchor.id}
                        id={outputAnchor.id}
                        style={{
                            height: 12,
                            width: 12,
                            top: getAnchorPosition(index),
                            backgroundColor: nodeColor,
                            position: 'absolute',
                            right: -6,
                            opacity: 0.8,
                            transition: 'all 0.2s ease-in-out',
                            borderRadius: '2px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </CardWrapper>
        </>
    )
}

MarketplaceCanvasNode.propTypes = {
    data: PropTypes.object
}

export default MarketplaceCanvasNode

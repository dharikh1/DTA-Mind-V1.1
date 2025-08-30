import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { Box, IconButton, Collapse } from '@mui/material'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import PropTypes from 'prop-types'
import AddNodes from '@/views/canvas/AddNodes'

const LeftPanel = ({ nodesData, selectedNode, onFlowGenerated, onPanelToggle }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const [isPanelOpen, setIsPanelOpen] = useState(true)

    const togglePanel = () => {
        const newState = !isPanelOpen
        setIsPanelOpen(newState)
        if (onPanelToggle) {
            onPanelToggle(newState)
        }
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                left: 0,
                top: '80px', // Below the menu bar
                height: 'calc(100vh - 80px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'stretch'
            }}
        >
            {/* Toggle Button */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    backgroundColor: theme.palette.background.paper,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover
                    }
                }}
                onClick={togglePanel}
            >
                {isPanelOpen ? (
                    <IconChevronLeft size={16} />
                ) : (
                    <IconChevronRight size={16} />
                )}
            </Box>

            {/* Collapsible Panel */}
            <Collapse
                in={isPanelOpen}
                orientation="horizontal"
                sx={{
                    '& .MuiCollapse-wrapper': {
                        width: '280px'
                    }
                }}
            >
                <Box
                    sx={{
                        width: '280px',
                        height: '100%',
                        backgroundColor: theme.palette.background.paper,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden'
                    }}
                >
                    <AddNodes
                        isAgentCanvas={true}
                        isAgentflowv2={true}
                        nodesData={nodesData}
                        node={selectedNode}
                        onFlowGenerated={onFlowGenerated}
                        isEmbedded={true} // New prop to indicate it's embedded
                    />
                </Box>
            </Collapse>
        </Box>
    )
}

LeftPanel.propTypes = {
    nodesData: PropTypes.array,
    selectedNode: PropTypes.object,
    onFlowGenerated: PropTypes.func,
    onPanelToggle: PropTypes.func
}

export default LeftPanel

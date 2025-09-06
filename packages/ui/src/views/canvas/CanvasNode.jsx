import PropTypes from 'prop-types'
import { useContext, useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { IconButton, Box, Typography, Divider, Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

// project imports
import NodeCardWrapper from '@/ui-component/cards/NodeCardWrapper'
import NodeTooltip from '@/ui-component/tooltip/NodeTooltip'
import NodeInputHandler from './NodeInputHandler'
import NodeOutputHandler from './NodeOutputHandler'
import AdditionalParamsDialog from '@/ui-component/dialog/AdditionalParamsDialog'
import NodeInfoDialog from '@/ui-component/dialog/NodeInfoDialog'

// const
import { baseURL } from '@/store/constant'
import { IconTrash, IconCopy, IconInfoCircle, IconAlertTriangle, IconRobot, IconLink, IconArrowsSplit, IconCode, IconDatabase, IconBrain, IconArrowLeft, IconRoute, IconPlayerPlay, IconWorld, IconUsers, IconSparkles, IconRefresh, IconRepeat, IconFileText } from '@tabler/icons-react'
import { flowContext } from '@/store/context/ReactFlowContext'
import LlamaindexPNG from '@/assets/images/llamaindex.png'

// ===========================|| CANVAS NODE ||=========================== //

const CanvasNode = ({ data }) => {
    const theme = useTheme()
    const canvas = useSelector((state) => state.canvas)
    const { deleteNode, duplicateNode } = useContext(flowContext)

    // Get node icon and color based on node type (same as AddNodes panel)
    const getNodeIconAndColor = (node) => {
        const nodeLabel = node.label.toLowerCase()
        
        // Map node types to their icons and colors based on the image
        if (nodeLabel.includes('agent')) {
            return { icon: IconRobot, color: '#8B5CF6' } // Purple
        } else if (nodeLabel.includes('api') || nodeLabel.includes('webhook')) {
            return { icon: IconLink, color: '#3B82F6' } // Blue
        } else if (nodeLabel.includes('condition') || nodeLabel.includes('if')) {
            return { icon: IconArrowsSplit, color: '#F59E0B' } // Orange
        } else if (nodeLabel.includes('function') || nodeLabel.includes('custom')) {
            return { icon: IconCode, color: '#EF4444' } // Red
        } else if (nodeLabel.includes('knowledge') || nodeLabel.includes('vector') || nodeLabel.includes('document')) {
            return { icon: IconDatabase, color: '#06B6D4' } // Teal
        } else if (nodeLabel.includes('memory')) {
            return { icon: IconBrain, color: '#EC4899' } // Pink
        } else if (nodeLabel.includes('response') || nodeLabel.includes('reply') || nodeLabel.includes('output')) {
            return { icon: IconArrowLeft, color: '#3B82F6' } // Blue
        } else if (nodeLabel.includes('router') || nodeLabel.includes('switch')) {
            return { icon: IconRoute, color: '#10B981' } // Green
        } else if (nodeLabel.includes('execute') || nodeLabel.includes('flow')) {
            return { icon: IconPlayerPlay, color: '#10B981' } // Green
        } else if (nodeLabel.includes('http')) {
            return { icon: IconWorld, color: '#EF4444' } // Red
        } else if (nodeLabel.includes('human') || nodeLabel.includes('input')) {
            return { icon: IconUsers, color: '#8B5CF6' } // Purple
        } else if (nodeLabel.includes('llm') || nodeLabel.includes('ai') || nodeLabel.includes('chat')) {
            return { icon: IconSparkles, color: '#3B82F6' } // Blue
        } else if (nodeLabel.includes('retriever') || nodeLabel.includes('search')) {
            return { icon: IconFileText, color: '#6B7280' } // Gray
        } else if (nodeLabel.includes('start') || nodeLabel.includes('begin')) {
            return { icon: IconPlayerPlay, color: '#10B981' } // Green
        } else if (nodeLabel.includes('iteration') || nodeLabel.includes('loop') || nodeLabel.includes('repeat')) {
            return { icon: IconRefresh, color: '#F59E0B' } // Orange
        } else if (nodeLabel.includes('tool') || (node.name && node.name.toLowerCase().includes('tool'))) {
            return { icon: IconCode, color: '#8B5CF6' } // Purple
        }
        
        // Default fallback
        return { icon: IconCode, color: '#6B7280' } // Gray
    }

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [showInfoDialog, setShowInfoDialog] = useState(false)
    const [infoDialogProps, setInfoDialogProps] = useState({})
    const [warningMessage, setWarningMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [isForceCloseNodeInfo, setIsForceCloseNodeInfo] = useState(null)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const getNodeInfoOpenStatus = () => {
        if (isForceCloseNodeInfo) return false
        else return !canvas.canvasDialogShow && open
    }

    const nodeOutdatedMessage = (oldVersion, newVersion) => `Node version ${oldVersion} outdated\nUpdate to latest version ${newVersion}`

    const nodeVersionEmptyMessage = (newVersion) => `Node outdated\nUpdate to latest version ${newVersion}`

    const onDialogClicked = () => {
        const dialogProps = {
            data,
            inputParams: data.inputParams.filter((inputParam) => !inputParam.hidden).filter((param) => param.additionalParams),
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        }
        setDialogProps(dialogProps)
        setShowDialog(true)
    }

    const getBorderColor = () => {
        if (data.selected) return theme.palette.primary.main
        else if (theme?.customization?.isDarkMode) return theme.palette.grey[900] + 25
        else return theme.palette.grey[900] + 50
    }

    useEffect(() => {
        const componentNode = canvas.componentNodes.find((nd) => nd.name === data.name)
        if (componentNode) {
            if (!data.version) {
                setWarningMessage(nodeVersionEmptyMessage(componentNode.version))
            } else if (data.version && componentNode.version > data.version) {
                setWarningMessage(nodeOutdatedMessage(data.version, componentNode.version))
            } else if (componentNode.badge === 'DEPRECATING') {
                setWarningMessage(
                    componentNode?.deprecateMessage ??
                        'This node will be deprecated in the next release. Change to a new node tagged with NEW'
                )
            } else {
                setWarningMessage('')
            }
        }
    }, [canvas.componentNodes, data.name, data.version])

    return (
        <>
            <NodeCardWrapper
                content={false}
                sx={{
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative'
                }}
                border={false}
            >
                {/* Perfect Circular Node - Matching Image */}
                <div
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'rgba(173, 216, 230, 0.1)',
                        border: '2px solid rgba(173, 216, 230, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'grab',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {/* Icon Container Inside Circle */}
                    {(() => {
                        const iconData = getNodeIconAndColor(data)
                        const { icon: IconComponent, color } = iconData
                        return (
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '12px',
                                    backgroundColor: color,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <IconComponent size={30} color="white" />
                            </div>
                        )
                    })()}
                </div>

                {/* Title Below Circle - Matching Image */}
                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textAlign: 'center',
                        color: '#333333',
                        marginTop: '8px',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {data.label}
                </Typography>
            </NodeCardWrapper>

            {/* Additional Params Dialog */}
            <AdditionalParamsDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
            ></AdditionalParamsDialog>
            <NodeInfoDialog show={showInfoDialog} dialogProps={infoDialogProps} onCancel={() => setShowInfoDialog(false)}></NodeInfoDialog>
        </>
    )
}

CanvasNode.propTypes = {
    data: PropTypes.object
}

export default memo(CanvasNode)

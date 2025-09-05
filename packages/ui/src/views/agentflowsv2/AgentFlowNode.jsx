import PropTypes from 'prop-types'
import { useContext, memo, useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Handle, Position, useUpdateNodeInternals, NodeToolbar } from 'reactflow'

// material-ui
import { styled, useTheme, alpha, darken, lighten } from '@mui/material/styles'
import { ButtonGroup, Avatar, Box, Typography, IconButton, Tooltip } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import { flowContext } from '@/store/context/ReactFlowContext'
import NodeInfoDialog from '@/ui-component/dialog/NodeInfoDialog'

// icons
import {
    IconCheck,
    IconExclamationMark,
    IconCircleChevronRightFilled,
    IconCopy,
    IconTrash,
    IconInfoCircle,
    IconLoader,
    IconAlertCircleFilled
} from '@tabler/icons-react'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import CancelIcon from '@mui/icons-material/Cancel'

// const
import { baseURL, AGENTFLOW_ICONS } from '@/store/constant'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    border: 'solid 2px',
    width: '120px',
    height: '120px',
    padding: '0',
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
}))

const StyledNodeToolbar = styled(NodeToolbar)(({ theme }) => ({
    backgroundColor: theme.palette.card.main,
    color: theme.darkTextPrimary,
    padding: '5px',
    borderRadius: '10px',
    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
}))

// ===========================|| CANVAS NODE ||=========================== //

const AgentFlowNode = ({ data }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const canvas = useSelector((state) => state.canvas)
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()
    // eslint-disable-next-line
    const [position, setPosition] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [warningMessage, setWarningMessage] = useState('')
    const { deleteNode, duplicateNode } = useContext(flowContext)
    const [showInfoDialog, setShowInfoDialog] = useState(false)
    const [infoDialogProps, setInfoDialogProps] = useState({})

    const defaultColor = '#666666' // fallback color if data.color is not present
    const nodeColor = data.color || defaultColor

    // Get different shades of the color based on state
    const getStateColor = () => {
        if (data.selected) return nodeColor
        if (isHovered) return alpha(nodeColor, 0.8)
        return alpha(nodeColor, 0.5)
    }

    const getOutputAnchors = () => {
        return data.outputAnchors ?? []
    }

    const getAnchorPosition = (index) => {
        const currentHeight = ref.current?.clientHeight || 0
        const spacing = currentHeight / (getOutputAnchors().length + 1)
        const position = spacing * (index + 1)

        // Update node internals when we get a non-zero position
        if (position > 0) {
            updateNodeInternals(data.id)
        }

        return position
    }

    const getMinimumHeight = () => {
        const outputCount = getOutputAnchors().length
        // Use exactly 60px as minimum height
        return Math.max(60, outputCount * 20 + 40)
    }

    const getBackgroundColor = () => {
        if (customization.isDarkMode) {
            return isHovered ? darken(nodeColor, 0.7) : darken(nodeColor, 0.8)
        }
        return isHovered ? lighten(nodeColor, 0.8) : lighten(nodeColor, 0.9)
    }

    const getStatusBackgroundColor = (status) => {
        switch (status) {
            case 'ERROR':
                return theme.palette.error.dark
            case 'INPROGRESS':
                return theme.palette.warning.dark
            case 'STOPPED':
            case 'TERMINATED':
                return theme.palette.error.main
            case 'FINISHED':
                return theme.palette.success.dark
            default:
                return theme.palette.primary.dark
        }
    }

    const renderIcon = (node) => {
        const foundIcon = AGENTFLOW_ICONS.find((icon) => icon.name === node.name)

        if (!foundIcon) return null
        return <foundIcon.icon size={24} color={'white'} />
    }

    useEffect(() => {
        if (ref.current) {
            setTimeout(() => {
                setPosition(ref.current?.offsetTop + ref.current?.clientHeight / 2)
                updateNodeInternals(data.id)
            }, 10)
        }
    }, [data, ref, updateNodeInternals])

    useEffect(() => {
        const nodeOutdatedMessage = (oldVersion, newVersion) =>
            `Node version ${oldVersion} outdated\nUpdate to latest version ${newVersion}`
        const nodeVersionEmptyMessage = (newVersion) => `Node outdated\nUpdate to latest version ${newVersion}`

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
        <div ref={ref} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <StyledNodeToolbar>
                <ButtonGroup sx={{ gap: 1 }} variant='outlined' aria-label='Basic button group'>
                    {data.name !== 'startAgentflow' && (
                        <IconButton
                            size={'small'}
                            title='Duplicate'
                            onClick={() => {
                                duplicateNode(data.id)
                            }}
                            sx={{
                                color: customization.isDarkMode ? 'white' : 'inherit',
                                '&:hover': {
                                    color: theme.palette.primary.main
                                }
                            }}
                        >
                            <IconCopy size={20} />
                        </IconButton>
                    )}
                    <IconButton
                        size={'small'}
                        title='Delete'
                        onClick={() => {
                            deleteNode(data.id)
                        }}
                        sx={{
                            color: customization.isDarkMode ? 'white' : 'inherit',
                            '&:hover': {
                                color: theme.palette.error.main
                            }
                        }}
                    >
                        <IconTrash size={20} />
                    </IconButton>
                    <IconButton
                        size={'small'}
                        title='Info'
                        onClick={() => {
                            setInfoDialogProps({ data })
                            setShowInfoDialog(true)
                        }}
                        sx={{
                            color: customization.isDarkMode ? 'white' : 'inherit',
                            '&:hover': {
                                color: theme.palette.info.main
                            }
                        }}
                    >
                        <IconInfoCircle size={20} />
                    </IconButton>
                </ButtonGroup>
            </StyledNodeToolbar>
            
            {/* Main container with circular node and title below */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <CardWrapper
                    content={false}
                    sx={{
                        borderColor: getStateColor(),
                        backgroundColor: getBackgroundColor(),
                        '&:hover': {
                            boxShadow: data.selected ? `0 0 0 2px ${getStateColor()} !important` : '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }
                    }}
                    border={false}
                >
                    {/* Status indicators */}
                    {data && data.status && (
                        <Tooltip title={data.status === 'ERROR' ? data.error || 'Error' : ''}>
                            <Avatar
                                variant='rounded'
                                sx={{
                                    ...theme.typography.smallAvatar,
                                    borderRadius: '50%',
                                    background:
                                        data.status === 'STOPPED' || data.status === 'TERMINATED'
                                            ? 'white'
                                            : getStatusBackgroundColor(data.status),
                                    color: 'white',
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    zIndex: 2
                                }}
                            >
                                {data.status === 'INPROGRESS' ? (
                                    <IconLoader className='spin-animation' />
                                ) : data.status === 'ERROR' ? (
                                    <IconExclamationMark />
                                ) : data.status === 'TERMINATED' ? (
                                    <CancelIcon sx={{ color: getStatusBackgroundColor(data.status) }} />
                                ) : data.status === 'STOPPED' ? (
                                    <StopCircleIcon sx={{ color: getStatusBackgroundColor(data.status) }} />
                                ) : (
                                    <IconCheck />
                                )}
                            </Avatar>
                        </Tooltip>
                    )}

                    {warningMessage && (
                        <Tooltip placement='right-start' title={<span style={{ whiteSpace: 'pre-line' }}>{warningMessage}</span>}>
                            <Avatar
                                variant='rounded'
                                sx={{
                                    ...theme.typography.smallAvatar,
                                    borderRadius: '50%',
                                    background: 'white',
                                    position: 'absolute',
                                    top: -8,
                                    left: -8,
                                    zIndex: 2
                                }}
                            >
                                <IconAlertCircleFilled color='orange' />
                            </Avatar>
                        </Tooltip>
                    )}

                    {/* Input handle */}
                    {!data.hideInput && (
                        <Handle
                            type='target'
                            position={Position.Left}
                            id={data.id}
                            style={{
                                width: 8,
                                height: 8,
                                backgroundColor: nodeColor,
                                border: 'none',
                                position: 'absolute',
                                left: -4,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                borderRadius: '50%'
                            }}
                        />
                    )}

                    {/* Rounded square container for icon */}
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '12px',
                            backgroundColor: alpha(nodeColor, 0.8),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'grab'
                        }}
                    >
                        {data.color && !data.icon ? (
                            renderIcon(data)
                        ) : (
                            <img
                                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                                src={`${baseURL}/api/v1/node-icon/${data.name}`}
                                alt={data.name}
                            />
                        )}
                    </Box>

                    {/* Output handles */}
                    {getOutputAnchors().map((outputAnchor, index) => {
                        return (
                            <Handle
                                type='source'
                                position={Position.Right}
                                key={outputAnchor.id}
                                id={outputAnchor.id}
                                style={{
                                    height: 8,
                                    width: 8,
                                    top: getAnchorPosition(index),
                                    backgroundColor: nodeColor,
                                    border: 'none',
                                    position: 'absolute',
                                    right: -4,
                                    opacity: isHovered ? 1 : 0,
                                    transition: 'opacity 0.2s',
                                    borderRadius: '50%'
                                }}
                            />
                        )
                    })}
                </CardWrapper>
                
                {/* Title outside the circle */}
                <Typography
                    sx={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        textAlign: 'center',
                        maxWidth: '140px',
                        wordWrap: 'break-word'
                    }}
                >
                    {data.label}
                </Typography>
            </Box>
            
            <NodeInfoDialog show={showInfoDialog} dialogProps={infoDialogProps} onCancel={() => setShowInfoDialog(false)}></NodeInfoDialog>
        </div>
    )
}

AgentFlowNode.propTypes = {
    data: PropTypes.object
}

export default memo(AgentFlowNode)

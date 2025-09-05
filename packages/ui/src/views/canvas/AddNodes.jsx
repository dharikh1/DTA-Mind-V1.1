import { useState, useRef, useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    ClickAwayListener,
    Divider,
    InputAdornment,
    List,
    ListItemButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    OutlinedInput,
    Paper,
    Popper,
    Stack,
    Typography,
    Chip,
    Tab,
    Tabs
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import Transitions from '@/ui-component/extended/Transitions'
import { StyledFab } from '@/ui-component/button/StyledFab'
import AgentflowGeneratorDialog from '@/ui-component/dialog/AgentflowGeneratorDialog'

// icons
import { IconPlus, IconSearch, IconMinus, IconX, IconSparkles, IconRobot, IconLink, IconArrowsSplit, IconCode, IconDatabase, IconBrain, IconArrowLeft, IconRoute } from '@tabler/icons-react'
import LlamaindexPNG from '@/assets/images/llamaindex.png'
import LangChainPNG from '@/assets/images/langchain.png'
import utilNodesPNG from '@/assets/images/utilNodes.png'

// const
import { baseURL, AGENTFLOW_ICONS } from '@/store/constant'
import { SET_COMPONENT_NODES } from '@/store/actions'

// ==============================|| ADD NODES||============================== //
function a11yProps(index) {
    return {
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`
    }
}

const blacklistCategoriesForAgentCanvas = ['Agents', 'Memory', 'Record Manager', 'Utilities']

const agentMemoryNodes = ['agentMemory', 'sqliteAgentMemory', 'postgresAgentMemory', 'mySQLAgentMemory']

// Show blacklisted nodes (exceptions) for agent canvas
const exceptionsForAgentCanvas = {
    Memory: agentMemoryNodes,
    Utilities: ['getVariable', 'setVariable', 'stickyNote']
}

// Hide some nodes from the chatflow canvas
const blacklistForChatflowCanvas = {
    Memory: agentMemoryNodes
}

const AddNodes = ({ nodesData, node, isAgentCanvas, isAgentflowv2, onFlowGenerated, isEmbedded = false }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState('')
    const [nodes, setNodes] = useState({})
    const [open, setOpen] = useState(false)
    const [categoryExpanded, setCategoryExpanded] = useState({})
    const [tabValue, setTabValue] = useState(0)

    const [openDialog, setOpenDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})

    const isAgentCanvasV2 = window.location.pathname.includes('/v2/agentcanvas')

    const anchorRef = useRef(null)
    const prevOpen = useRef(open)
    const ps = useRef()

    const scrollTop = () => {
        const curr = ps.current
        if (curr) {
            curr.scrollTop = 0
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        filterSearch(searchValue, newValue)
    }

    const addException = (category) => {
        let nodes = []
        if (category) {
            const nodeNames = exceptionsForAgentCanvas[category] || []
            nodes = nodesData.filter((nd) => nd.category === category && nodeNames.includes(nd.name))
        } else {
            for (const category in exceptionsForAgentCanvas) {
                const nodeNames = exceptionsForAgentCanvas[category]
                nodes.push(...nodesData.filter((nd) => nd.category === category && nodeNames.includes(nd.name)))
            }
        }
        return nodes
    }

    const getSearchedNodes = (value) => {
        if (isAgentCanvas) {
            const nodes = nodesData.filter((nd) => !blacklistCategoriesForAgentCanvas.includes(nd.category))
            nodes.push(...addException())
            const passed = nodes.filter((nd) => {
                const passesName = nd.name.toLowerCase().includes(value.toLowerCase())
                const passesLabel = nd.label.toLowerCase().includes(value.toLowerCase())
                const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
                return passesName || passesCategory || passesLabel
            })
            return passed
        }
        let nodes = nodesData.filter((nd) => nd.category !== 'Multi Agents' && nd.category !== 'Sequential Agents')

        for (const category in blacklistForChatflowCanvas) {
            const nodeNames = blacklistForChatflowCanvas[category]
            nodes = nodes.filter((nd) => !nodeNames.includes(nd.name))
        }

        const passed = nodes.filter((nd) => {
            const passesName = nd.name.toLowerCase().includes(value.toLowerCase())
            const passesLabel = nd.label.toLowerCase().includes(value.toLowerCase())
            const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
            return passesName || passesCategory || passesLabel
        })
        return passed
    }

    const filterSearch = (value, newTabValue) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const returnData = getSearchedNodes(value)
                groupByCategory(returnData, newTabValue ?? tabValue, true)
                scrollTop()
            } else if (value === '') {
                groupByCategory(nodesData, newTabValue ?? tabValue)
                scrollTop()
            }
        }, 500)
    }

    const groupByTags = (nodes, newTabValue = 0) => {
        const aiBuilderNodes = nodes.filter((nd) => !nd.tags)
        const dataSearchNodes = nodes.filter((nd) => nd.tags && nd.tags.includes('LlamaIndex'))
        if (newTabValue === 0) {
            return aiBuilderNodes
        } else if (newTabValue === 1) {
            return dataSearchNodes
        } else {
            return []
        }
    }

    const groupByCategory = (nodes, newTabValue, isFilter) => {
        if (isAgentCanvas) {
            const accordianCategories = {}
            const result = nodes.reduce(function (r, a) {
                r[a.category] = r[a.category] || []
                r[a.category].push(a)
                accordianCategories[a.category] = isFilter ? true : false
                return r
            }, Object.create(null))

            const filteredResult = {}
            for (const category in result) {
                if (isAgentCanvasV2) {
                    if (category !== 'Agent Flows') {
                        continue
                    }
                } else {
                    if (category === 'Agent Flows') {
                        continue
                    }
                }
                // Filter out blacklisted categories
                if (!blacklistCategoriesForAgentCanvas.includes(category)) {
                    // Filter out LlamaIndex nodes
                    const nodes = result[category].filter((nd) => !nd.tags || !nd.tags.includes('LlamaIndex'))
                    if (!nodes.length) continue

                    filteredResult[category] = nodes
                }

                // Allow exceptionsForAgentCanvas
                if (Object.keys(exceptionsForAgentCanvas).includes(category)) {
                    filteredResult[category] = addException(category)
                }
            }
            setNodes(filteredResult)
            accordianCategories['Multi Agents'] = true
            accordianCategories['Sequential Agents'] = true
            accordianCategories['Memory'] = true
            accordianCategories['Agent Flows'] = true
            setCategoryExpanded(accordianCategories)
        } else {
            const taggedNodes = groupByTags(nodes, newTabValue)
            const accordianCategories = {}
            const result = taggedNodes.reduce(function (r, a) {
                r[a.category] = r[a.category] || []
                r[a.category].push(a)
                accordianCategories[a.category] = isFilter ? true : false
                return r
            }, Object.create(null))

            const filteredResult = {}
            for (const category in result) {
                if (category === 'Agent Flows' || category === 'Multi Agents' || category === 'Sequential Agents') {
                    continue
                }
                if (Object.keys(blacklistForChatflowCanvas).includes(category)) {
                    const nodes = blacklistForChatflowCanvas[category]
                    result[category] = result[category].filter((nd) => !nodes.includes(nd.name))
                }
                filteredResult[category] = result[category]
            }

            setNodes(filteredResult)
            setCategoryExpanded(accordianCategories)
        }
    }

    const handleAccordionChange = (category) => (event, isExpanded) => {
        const accordianCategories = { ...categoryExpanded }
        accordianCategories[category] = isExpanded
        setCategoryExpanded(accordianCategories)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const onDragStart = (event, node) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node))
        event.dataTransfer.effectAllowed = 'move'
    }

    const getImage = (tabValue) => {
        if (tabValue === 0) {
            return LangChainPNG
        } else if (tabValue === 1) {
            return LlamaindexPNG
        } else {
            return utilNodesPNG
        }
    }

    const renderIcon = (node) => {
        const foundIcon = AGENTFLOW_ICONS.find((icon) => icon.name === node.name)

        if (!foundIcon) return null
        return <foundIcon.icon size={30} color={node.color} />
    }

    // Get node icon and color based on node type
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
        }
        
        // Default fallback - use original icon system for other nodes
        return null
    }

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
        }

        prevOpen.current = open
    }, [open])

    useEffect(() => {
        if (node) setOpen(false)
    }, [node])

    useEffect(() => {
        if (nodesData) {
            groupByCategory(nodesData)
            dispatch({ type: SET_COMPONENT_NODES, componentNodes: nodesData })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodesData, dispatch])

    // Handle dialog open/close
    const handleOpenDialog = () => {
        setOpenDialog(true)
        setDialogProps({
            title: 'What would you like to build?',
            description:
                'Enter your prompt to generate an agentflow. Performance may vary with different models. Only nodes and edges are generated, you will need to fill in the input fields for each node.'
        })
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const handleConfirmDialog = () => {
        setOpenDialog(false)
        onFlowGenerated()
    }

    // If embedded, render the content directly without the floating button and popper
    if (isEmbedded) {
        return (
            <>
                <AgentflowGeneratorDialog
                    show={openDialog}
                    dialogProps={dialogProps}
                    onCancel={handleCloseDialog}
                    onConfirm={handleConfirmDialog}
                />
                
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant='h5' sx={{ mb: 2 }}>Add Nodes</Typography>
                        <OutlinedInput
                            sx={{ width: '100%', pr: 2, pl: 2 }}
                            id='input-search-node'
                            value={searchValue}
                            onChange={(e) => filterSearch(e.target.value)}
                            placeholder='Search blocks...'
                            startAdornment={
                                <InputAdornment position='start'>
                                    <IconSearch stroke={1.5} size='1rem' color={theme.palette.grey[500]} />
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment
                                    position='end'
                                    sx={{
                                        cursor: 'pointer',
                                        color: theme.palette.grey[500],
                                        '&:hover': {
                                            color: theme.palette.grey[900]
                                        }
                                    }}
                                    title='Clear Search'
                                >
                                    <IconX
                                        stroke={1.5}
                                        size='1rem'
                                        onClick={() => filterSearch('')}
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    />
                                </InputAdornment>
                            }
                            aria-describedby='search-helper-text'
                            inputProps={{
                                'aria-label': 'weight'
                            }}
                        />
                        {!isAgentCanvas && (
                            <Tabs
                                sx={{ position: 'relative', minHeight: '50px', height: '50px', mt: 2 }}
                                variant='fullWidth'
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label='tabs'
                            >
                                {['AI Builder', 'Data Search'].map((item, index) => (
                                    <Tab
                                        icon={
                                            <div
                                                style={{
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: index === 0 ? '#3B82F6' : '#10B981'
                                                }}
                                            >
                                                {index === 0 ? (
                                                    <IconSparkles size={12} color='white' />
                                                ) : (
                                                    <IconSearch size={12} color='white' />
                                                )}
                                            </div>
                                        }
                                        iconPosition='start'
                                        sx={{ minHeight: '50px', height: '50px' }}
                                        key={index}
                                        label={item}
                                        {...a11yProps(index)}
                                    ></Tab>
                                ))}
                            </Tabs>
                        )}
                    </Box>
                    
                    <PerfectScrollbar
                        containerRef={(el) => {
                            ps.current = el
                        }}
                        style={{
                            height: '100%',
                            flex: 1,
                            overflowX: 'hidden'
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <List
                                sx={{
                                    width: '100%',
                                    py: 0,
                                    borderRadius: '10px',
                                    '& .MuiListItemSecondaryAction-root': {
                                        top: 22
                                    },
                                    '& .MuiDivider-root': {
                                        my: 0
                                    },
                                    '& .list-container': {
                                        pl: 7
                                    }
                                }}
                            >
                                {Object.keys(nodes)
                                    .sort()
                                    .map((category) => (
                                        <Accordion
                                            expanded={categoryExpanded[category] || false}
                                            onChange={handleAccordionChange(category)}
                                            key={category}
                                            disableGutters
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`nodes-accordian-${category}`}
                                                id={`nodes-accordian-header-${category}`}
                                            >
                                                {category.split(';').length > 1 ? (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Typography variant='h5'>{category.split(';')[0]}</Typography>
                                                        &nbsp;
                                                        <Chip
                                                            sx={{
                                                                width: 'max-content',
                                                                fontWeight: 700,
                                                                fontSize: '0.65rem',
                                                                background:
                                                                    category.split(';')[1] === 'DEPRECATING'
                                                                        ? theme.palette.warning.main
                                                                        : theme.palette.teal.main,
                                                                color:
                                                                    category.split(';')[1] !== 'DEPRECATING'
                                                                        ? 'white'
                                                                        : 'inherit'
                                                            }}
                                                            size='small'
                                                            label={category.split(';')[1]}
                                                        />
                                                    </div>
                                                ) : (
                                                    <Typography variant='h5'>{category}</Typography>
                                                )}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {nodes[category].map((node, index) => (
                                                    <div
                                                        key={node.name}
                                                        onDragStart={(event) => onDragStart(event, node)}
                                                        draggable
                                                    >
                                                        <ListItemButton
                                                            sx={{
                                                                p: 1.5,
                                                                borderRadius: `${customization.borderRadius}px`,
                                                                cursor: 'move',
                                                                mb: 0.5,
                                                                '&:hover': {
                                                                    backgroundColor: theme.palette.action.hover,
                                                                    transform: 'translateY(-1px)',
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                                },
                                                                transition: 'all 0.2s ease-in-out'
                                                            }}
                                                        >
                                                            <ListItem alignItems='center'>
                                                                {(() => {
                                                                    const iconData = getNodeIconAndColor(node)
                                                                    if (iconData) {
                                                                        const { icon: IconComponent, color } = iconData
                                                                        return (
                                                                            <ListItemAvatar>
                                                                                <div
                                                                                    style={{
                                                                                        width: 40,
                                                                                        height: 40,
                                                                                        borderRadius: '8px',
                                                                                        backgroundColor: color,
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                                    }}
                                                                                >
                                                                                    <IconComponent size={20} color="white" />
                                                                                </div>
                                                                            </ListItemAvatar>
                                                                        )
                                                                    } else {
                                                                        // Fallback to original icon system
                                                                        return node.color && !node.icon ? (
                                                                            <ListItemAvatar>
                                                                                <div
                                                                                    style={{
                                                                                        width: 40,
                                                                                        height: 40,
                                                                                        borderRadius: '8px',
                                                                                        backgroundColor: node.color,
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                                    }}
                                                                                >
                                                                                    {renderIcon(node)}
                                                                                </div>
                                                                            </ListItemAvatar>
                                                                        ) : (
                                                                            <ListItemAvatar>
                                                                                <div
                                                                                    style={{
                                                                                        width: 40,
                                                                                        height: 40,
                                                                                        borderRadius: '8px',
                                                                                        backgroundColor: '#f8f9fa',
                                                                                        border: '1px solid #e9ecef',
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                                    }}
                                                                                >
                                                                                    <img
                                                                                        style={{
                                                                                            width: '24px',
                                                                                            height: '24px',
                                                                                            objectFit: 'contain'
                                                                                        }}
                                                                                        alt={node.name}
                                                                                        src={`${baseURL}/api/v1/node-icon/${node.name}`}
                                                                                    />
                                                                                </div>
                                                                            </ListItemAvatar>
                                                                        )
                                                                    }
                                                                })()}
                                                                <ListItemText
                                                                    sx={{ 
                                                                        ml: 1,
                                                                        '& .MuiListItemText-primary': {
                                                                            fontSize: '0.95rem',
                                                                            fontWeight: 500,
                                                                            color: theme.palette.text.primary
                                                                        }
                                                                    }}
                                                                    primary={
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                flexDirection: 'row',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'space-between',
                                                                                width: '100%'
                                                                            }}
                                                                        >
                                                                            <span>{node.label}</span>
                                                                            {node.badge && (
                                                                                <Chip
                                                                                    sx={{
                                                                                        width: 'max-content',
                                                                                        fontWeight: 700,
                                                                                        fontSize: '0.65rem',
                                                                                        background:
                                                                                            node.badge === 'DEPRECATING'
                                                                                                ? theme.palette.warning.main
                                                                                                : theme.palette.teal.main,
                                                                                        color:
                                                                                            node.badge !== 'DEPRECATING'
                                                                                                ? 'white'
                                                                                                : 'inherit'
                                                                                    }}
                                                                                    size='small'
                                                                                    label={node.badge}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    }
                                                                />
                                                            </ListItem>
                                                        </ListItemButton>
                                                        {index === nodes[category].length - 1 ? null : <Divider />}
                                                    </div>
                                                ))}
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                            </List>
                        </Box>
                    </PerfectScrollbar>
                </Box>
            </>
        )
    }

    return (
        <>
            <StyledFab
                sx={{ left: 20, top: 20 }}
                ref={anchorRef}
                size='small'
                color='primary'
                aria-label='add'
                title='Add Node'
                onClick={handleToggle}
            >
                {open ? <IconMinus /> : <IconPlus />}
            </StyledFab>


            <AgentflowGeneratorDialog
                show={openDialog}
                dialogProps={dialogProps}
                onCancel={handleCloseDialog}
                onConfirm={handleConfirmDialog}
            />

            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [-40, 14]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Typography variant='h4'>Add Nodes</Typography>
                                        </Stack>
                                        <OutlinedInput
                                            // eslint-disable-next-line
                                            autoFocus
                                            sx={{ width: '100%', pr: 2, pl: 2, my: 2 }}
                                            id='input-search-node'
                                            value={searchValue}
                                            onChange={(e) => filterSearch(e.target.value)}
                                            placeholder='Search blocks...'
                                            startAdornment={
                                                <InputAdornment position='start'>
                                                    <IconSearch stroke={1.5} size='1rem' color={theme.palette.grey[500]} />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment
                                                    position='end'
                                                    sx={{
                                                        cursor: 'pointer',
                                                        color: theme.palette.grey[500],
                                                        '&:hover': {
                                                            color: theme.palette.grey[900]
                                                        }
                                                    }}
                                                    title='Clear Search'
                                                >
                                                    <IconX
                                                        stroke={1.5}
                                                        size='1rem'
                                                        onClick={() => filterSearch('')}
                                                        style={{
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </InputAdornment>
                                            }
                                            aria-describedby='search-helper-text'
                                            inputProps={{
                                                'aria-label': 'weight'
                                            }}
                                        />
                                        {!isAgentCanvas && (
                                            <Tabs
                                                sx={{ position: 'relative', minHeight: '50px', height: '50px' }}
                                                variant='fullWidth'
                                                value={tabValue}
                                                onChange={handleTabChange}
                                                aria-label='tabs'
                                            >
                                                {['AI Builder', 'Data Search'].map((item, index) => (
                                                    <Tab
                                                        icon={
                                                            <div
                                                                style={{
                                                                    borderRadius: '50%',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    backgroundColor: index === 0 ? '#3B82F6' : '#10B981'
                                                                }}
                                                            >
                                                                {index === 0 ? (
                                                                    <IconSparkles size={12} color='white' />
                                                                ) : (
                                                                    <IconSearch size={12} color='white' />
                                                                )}
                                                            </div>
                                                        }
                                                        iconPosition='start'
                                                        sx={{ minHeight: '50px', height: '50px' }}
                                                        key={index}
                                                        label={item}
                                                        {...a11yProps(index)}
                                                    ></Tab>
                                                ))}
                                            </Tabs>
                                        )}

                                        <Divider />
                                    </Box>
                                    <PerfectScrollbar
                                        containerRef={(el) => {
                                            ps.current = el
                                        }}
                                        style={{
                                            height: '100%',
                                            maxHeight: `calc(100vh - ${isAgentCanvas ? '300' : '380'}px)`,
                                            overflowX: 'hidden'
                                        }}
                                    >
                                        <Box sx={{ p: 2, pt: 0 }}>
                                            <List
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 370,
                                                    py: 0,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        maxWidth: 370
                                                    },
                                                    '& .MuiListItemSecondaryAction-root': {
                                                        top: 22
                                                    },
                                                    '& .MuiDivider-root': {
                                                        my: 0
                                                    },
                                                    '& .list-container': {
                                                        pl: 7
                                                    }
                                                }}
                                            >
                                                {Object.keys(nodes)
                                                    .sort()
                                                    .map((category) => (
                                                        <Accordion
                                                            expanded={categoryExpanded[category] || false}
                                                            onChange={handleAccordionChange(category)}
                                                            key={category}
                                                            disableGutters
                                                        >
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls={`nodes-accordian-${category}`}
                                                                id={`nodes-accordian-header-${category}`}
                                                            >
                                                                {category.split(';').length > 1 ? (
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center'
                                                                        }}
                                                                    >
                                                                        <Typography variant='h5'>{category.split(';')[0]}</Typography>
                                                                        &nbsp;
                                                                        <Chip
                                                                            sx={{
                                                                                width: 'max-content',
                                                                                fontWeight: 700,
                                                                                fontSize: '0.65rem',
                                                                                background:
                                                                                    category.split(';')[1] === 'DEPRECATING'
                                                                                        ? theme.palette.warning.main
                                                                                        : theme.palette.teal.main,
                                                                                color:
                                                                                    category.split(';')[1] !== 'DEPRECATING'
                                                                                        ? 'white'
                                                                                        : 'inherit'
                                                                            }}
                                                                            size='small'
                                                                            label={category.split(';')[1]}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <Typography variant='h5'>{category}</Typography>
                                                                )}
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                {nodes[category].map((node, index) => (
                                                                    <div
                                                                        key={node.name}
                                                                        onDragStart={(event) => onDragStart(event, node)}
                                                                        draggable
                                                                    >
                                                                        <ListItemButton
                                                                            sx={{
                                                                                p: 1.5,
                                                                                borderRadius: `${customization.borderRadius}px`,
                                                                                cursor: 'move',
                                                                                mb: 0.5,
                                                                                '&:hover': {
                                                                                    backgroundColor: theme.palette.action.hover,
                                                                                    transform: 'translateY(-1px)',
                                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                                                },
                                                                                transition: 'all 0.2s ease-in-out'
                                                                            }}
                                                                        >
                                                                            <ListItem alignItems='center'>
                                                                                {(() => {
                                                                                    const iconData = getNodeIconAndColor(node)
                                                                                    if (iconData) {
                                                                                        const { icon: IconComponent, color } = iconData
                                                                                        return (
                                                                                            <ListItemAvatar>
                                                                                                <div
                                                                                                    style={{
                                                                                                        width: 40,
                                                                                                        height: 40,
                                                                                                        borderRadius: '8px',
                                                                                                        backgroundColor: color,
                                                                                                        display: 'flex',
                                                                                                        alignItems: 'center',
                                                                                                        justifyContent: 'center',
                                                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                                                    }}
                                                                                                >
                                                                                                    <IconComponent size={20} color="white" />
                                                                                                </div>
                                                                                            </ListItemAvatar>
                                                                                        )
                                                                                    } else {
                                                                                        // Fallback to original icon system
                                                                                        return node.color && !node.icon ? (
                                                                                            <ListItemAvatar>
                                                                                                <div
                                                                                                    style={{
                                                                                                        width: 40,
                                                                                                        height: 40,
                                                                                                        borderRadius: '8px',
                                                                                                        backgroundColor: node.color,
                                                                                                        display: 'flex',
                                                                                                        alignItems: 'center',
                                                                                                        justifyContent: 'center',
                                                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                                                    }}
                                                                                                >
                                                                                                    {renderIcon(node)}
                                                                                                </div>
                                                                                            </ListItemAvatar>
                                                                                        ) : (
                                                                                            <ListItemAvatar>
                                                                                                <div
                                                                                                    style={{
                                                                                                        width: 40,
                                                                                                        height: 40,
                                                                                                        borderRadius: '8px',
                                                                                                        backgroundColor: '#f8f9fa',
                                                                                                        border: '1px solid #e9ecef',
                                                                                                        display: 'flex',
                                                                                                        alignItems: 'center',
                                                                                                        justifyContent: 'center',
                                                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                                                    }}
                                                                                                >
                                                                                                    <img
                                                                                                        style={{
                                                                                                            width: '24px',
                                                                                                            height: '24px',
                                                                                                            objectFit: 'contain'
                                                                                                        }}
                                                                                                        alt={node.name}
                                                                                                        src={`${baseURL}/api/v1/node-icon/${node.name}`}
                                                                                                    />
                                                                                                </div>
                                                                                            </ListItemAvatar>
                                                                                        )
                                                                                    }
                                                                                })()}
                                                                                <ListItemText
                                                                                    sx={{ 
                                                                                        ml: 1,
                                                                                        '& .MuiListItemText-primary': {
                                                                                            fontSize: '0.95rem',
                                                                                            fontWeight: 500,
                                                                                            color: theme.palette.text.primary
                                                                                        }
                                                                                    }}
                                                                                    primary={
                                                                                        <div
                                                                                            style={{
                                                                                                display: 'flex',
                                                                                                flexDirection: 'row',
                                                                                                alignItems: 'center',
                                                                                                justifyContent: 'space-between',
                                                                                                width: '100%'
                                                                                            }}
                                                                                        >
                                                                                            <span>{node.label}</span>
                                                                                            {node.badge && (
                                                                                                <Chip
                                                                                                    sx={{
                                                                                                        width: 'max-content',
                                                                                                        fontWeight: 700,
                                                                                                        fontSize: '0.65rem',
                                                                                                        background:
                                                                                                            node.badge === 'DEPRECATING'
                                                                                                                ? theme.palette.warning.main
                                                                                                                : theme.palette.teal.main,
                                                                                                        color:
                                                                                                            node.badge !== 'DEPRECATING'
                                                                                                                ? 'white'
                                                                                                                : 'inherit'
                                                                                                    }}
                                                                                                    size='small'
                                                                                                    label={node.badge}
                                                                                                />
                                                                                            )}
                                                                                        </div>
                                                                                    }
                                                                                />
                                                                            </ListItem>
                                                                        </ListItemButton>
                                                                        {index === nodes[category].length - 1 ? null : <Divider />}
                                                                    </div>
                                                                ))}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))}
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    )
}

AddNodes.propTypes = {
    nodesData: PropTypes.array,
    node: PropTypes.object,
    onFlowGenerated: PropTypes.func,
    isAgentCanvas: PropTypes.bool,
    isAgentflowv2: PropTypes.bool,
    isEmbedded: PropTypes.bool
}

export default memo(AddNodes)

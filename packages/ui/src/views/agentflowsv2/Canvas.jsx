import { useEffect, useRef, useState, useCallback, useContext } from 'react'
import ReactFlow, { addEdge, Controls, MiniMap, Background, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import './index.css'
import { useReward } from 'react-rewards'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    REMOVE_DIRTY,
    SET_DIRTY,
    SET_CHATFLOW,
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar as closeSnackbarAction,
    SET_DARKMODE
} from '@/store/actions'
import { logoutSuccess } from '@/store/reducers/authSlice'
import { omit, cloneDeep } from 'lodash'

// material-ui
import { Toolbar, Box, AppBar, Button, Fab, Tabs, Tab, Typography, Card, CardContent, Grid, Switch, ButtonBase, Avatar } from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

// project imports
import CanvasNode from './AgentFlowNode'
import IterationNode from './IterationNode'
import AgentFlowEdge from './AgentFlowEdge'
import ConnectionLine from './ConnectionLine'
import StickyNote from './StickyNote'
import Logo from '@/ui-component/extended/Logo'
import ProfileSection from '@/layout/MainLayout/Header/ProfileSection'

import LeftPanel from './LeftPanel'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import SaveChatflowDialog from '@/ui-component/dialog/SaveChatflowDialog'
import EditNodeDialog from '@/views/agentflowsv2/EditNodeDialog'
import ChatPopUp from '@/views/chatmessage/ChatPopUp'
import ValidationPopUp from '@/views/chatmessage/ValidationPopUp'
import AgentflowGeneratorDialog from '@/ui-component/dialog/AgentflowGeneratorDialog'
import Settings from '@/views/settings'
import ViewMessagesDialog from '@/ui-component/dialog/ViewMessagesDialog'
import ViewLeadsDialog from '@/ui-component/dialog/ViewLeadsDialog'
import ChatflowConfigurationDialog from '@/ui-component/dialog/ChatflowConfigurationDialog'
import ExportAsTemplateDialog from '@/ui-component/dialog/ExportAsTemplateDialog'
import { flowContext } from '@/store/context/ReactFlowContext'

// API
import nodesApi from '@/api/nodes'
import chatflowsApi from '@/api/chatflows'
import accountApi from '@/api/account.api'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'
import { useConfig } from '@/store/context/ConfigContext'

// icons
import { IconX, IconRefreshAlert, IconMagnetFilled, IconMagnetOff, IconKey, IconShield, IconDatabase, IconDeviceFloppy, IconSettings } from '@tabler/icons-react'

// utils
import {
    getUniqueNodeLabel,
    getUniqueNodeId,
    initNode,
    updateOutdatedNodeData,
    updateOutdatedNodeEdge,
    isValidConnectionAgentflowV2
} from '@/utils/genericHelper'
import useNotifier from '@/utils/useNotifier'
import { usePrompt } from '@/utils/usePrompt'

// const
import { DTAMIND_CREDENTIAL_ID, AGENTFLOW_ICONS } from '@/store/constant'
import { store } from '@/store'

// Dark mode toggle switch component
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff'
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be'
            }
        }
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff'
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`
        }
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2
    }
}))

const nodeTypes = { agentFlow: CanvasNode, stickyNote: StickyNote, iteration: IterationNode }
const edgeTypes = { agentFlow: AgentFlowEdge }

// ==============================|| CANVAS ||============================== //

const AgentflowCanvas = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)
    const canvas = useSelector((state) => state.canvas)

    const { state } = useLocation()
    const templateFlowData = state ? state.templateFlowData : ''

    const URLpath = document.location.pathname.toString().split('/')
    const chatflowId =
        URLpath[URLpath.length - 1] === 'canvas' || URLpath[URLpath.length - 1] === 'agentcanvas' ? '' : URLpath[URLpath.length - 1]
    const canvasTitle = URLpath.includes('agentcanvas') ? 'Agent' : 'Chatflow'

    const { confirm } = useConfirm()

    const logoutApi = useApi(accountApi.logout)
    const { isEnterpriseLicensed, isCloud, isOpenSource } = useConfig()

    const [canvasDataStore, setCanvasDataStore] = useState(canvas)
    const [chatflow, setChatflow] = useState(null)
    const { reactFlowInstance, setReactFlowInstance } = useContext(flowContext)

    // ==============================|| Snackbar ||============================== //

    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const signOutClicked = () => {
        logoutApi.request()
        enqueueSnackbar({
            message: 'Logging out...',
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    useEffect(() => {
        try {
            if (logoutApi.data && logoutApi.data.message === 'logged_out') {
                store.dispatch(logoutSuccess())
                window.location.href = logoutApi.data.redirectTo
            }
        } catch (e) {
            console.error(e)
        }
    }, [logoutApi.data])

    // ==============================|| ReactFlow ||============================== //

    const [nodes, setNodes, onNodesChange] = useNodesState()
    const [edges, setEdges, onEdgesChange] = useEdgesState()

    const [selectedNode, setSelectedNode] = useState(null)
    const [isSyncNodesButtonEnabled, setIsSyncNodesButtonEnabled] = useState(false)
    const [editNodeDialogOpen, setEditNodeDialogOpen] = useState(false)
    const [editNodeDialogProps, setEditNodeDialogProps] = useState({})
    const [flowDialogOpen, setFlowDialogOpen] = useState(false)
    const [isSnappingEnabled, setIsSnappingEnabled] = useState(false)
    const [activeTab, setActiveTab] = useState('workflow') // Default to workflow tab
    const [agentflowGeneratorOpen, setAgentflowGeneratorOpen] = useState(false)
    
    // Settings dropdown state
    const [isSettingsOpen, setSettingsOpen] = useState(false)
    const [settingsAnchorEl, setSettingsAnchorEl] = useState(null)
    const [viewMessagesDialogOpen, setViewMessagesDialogOpen] = useState(false)
    const [viewMessagesDialogProps, setViewMessagesDialogProps] = useState({})
    const [viewLeadsDialogOpen, setViewLeadsDialogOpen] = useState(false)
    const [viewLeadsDialogProps, setViewLeadsDialogProps] = useState({})
    const [chatflowConfigurationDialogOpen, setChatflowConfigurationDialogOpen] = useState(false)
    
    // Dark mode state
    const [isDark, setIsDark] = useState(customization.isDarkMode)
    const [chatflowConfigurationDialogProps, setChatflowConfigurationDialogProps] = useState({})
    const [exportAsTemplateDialogOpen, setExportAsTemplateDialogOpen] = useState(false)
    const [exportAsTemplateDialogProps, setExportAsTemplateDialogProps] = useState({})

    const reactFlowWrapper = useRef(null)

    // ==============================|| Tab Handler ||============================== //

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
        
        // Navigate to specific pages for certain tabs
        if (newValue === 'templates') {
            navigate('/templates')
        } else if (newValue === 'schedule') {
            navigate('/schedule')
        } else if (newValue === 'assistants') {
            navigate('/assistants')
        } else if (newValue === 'credentials') {
            navigate('/credentials')
        } else if (newValue === 'apikey') {
            navigate('/apikey')
        } else if (newValue === 'document-stores') {
            navigate('/document-stores')
        } else if (newValue === 'workflow') {
            // Stay on current page for workflow
            setActiveTab('workflow')
        }
    }

    // ==============================|| Chatflow API ||============================== //

    const getNodesApi = useApi(nodesApi.getAllNodes)
    const createNewChatflowApi = useApi(chatflowsApi.createNewChatflow)
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)
    const getSpecificChatflowApi = useApi(chatflowsApi.getSpecificChatflow)

    // ==============================|| Events & Actions ||============================== //

    const onConnect = (params) => {
        if (!isValidConnectionAgentflowV2(params, reactFlowInstance)) {
            return
        }

        const nodeName = params.sourceHandle.split('_')[0]
        const targetNodeName = params.targetHandle.split('_')[0]

        const targetColor = AGENTFLOW_ICONS.find((icon) => icon.name === targetNodeName)?.color ?? theme.palette.primary.main
        const sourceColor = AGENTFLOW_ICONS.find((icon) => icon.name === nodeName)?.color ?? theme.palette.primary.main

        let edgeLabel = undefined
        if (nodeName === 'conditionAgentflow' || nodeName === 'conditionAgentAgentflow') {
            const _edgeLabel = params.sourceHandle.split('-').pop()
            edgeLabel = (isNaN(_edgeLabel) ? 0 : _edgeLabel).toString()
        }

        if (nodeName === 'humanInputAgentflow') {
            edgeLabel = params.sourceHandle.split('-').pop()
            edgeLabel = edgeLabel === '0' ? 'proceed' : 'reject'
        }

        // Check if both source and target nodes are within the same iteration node
        const sourceNode = reactFlowInstance.getNodes().find((node) => node.id === params.source)
        const targetNode = reactFlowInstance.getNodes().find((node) => node.id === params.target)
        const isWithinIterationNode = sourceNode?.parentNode && targetNode?.parentNode && sourceNode.parentNode === targetNode.parentNode

        const newEdge = {
            ...params,
            data: {
                ...params.data,
                sourceColor,
                targetColor,
                edgeLabel,
                isHumanInput: nodeName === 'humanInputAgentflow'
            },
            ...(isWithinIterationNode && { zIndex: 9999 }),
            type: 'agentFlow',
            id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`
        }
        setEdges((eds) => addEdge(newEdge, eds))
    }

    const handleLoadFlow = (file) => {
        try {
            const flowData = JSON.parse(file)
            const nodes = flowData.nodes || []

            setNodes(nodes)
            setEdges(flowData.edges || [])
            setTimeout(() => setDirty(), 0)
        } catch (e) {
            console.error(e)
        }
    }

    const handleAgentflowGeneration = () => {
        setAgentflowGeneratorOpen(true)
    }

    // Dark mode toggle handler
    const changeDarkMode = () => {
        dispatch({ type: SET_DARKMODE, isDarkMode: !isDark })
        setIsDark((isDark) => !isDark)
        localStorage.setItem('isDarkMode', !isDark)
    }

    // Settings dropdown handlers
    const handleSettingsClick = (event) => {
        setSettingsAnchorEl(event.currentTarget)
        setSettingsOpen(true)
    }

    const handleSettingsClose = () => {
        setSettingsOpen(false)
        setSettingsAnchorEl(null)
    }

    const handleSettingsItemClick = (setting) => {
        setSettingsOpen(false)
        setSettingsAnchorEl(null)

        if (setting === 'deleteChatflow') {
            handleDeleteFlow()
        } else if (setting === 'viewMessages') {
            setViewMessagesDialogProps({
                title: 'View Messages',
                chatflow: chatflow,
                isChatflow: false
            })
            setViewMessagesDialogOpen(true)
        } else if (setting === 'viewLeads') {
            setViewLeadsDialogProps({
                title: 'View Leads',
                chatflow: chatflow
            })
            setViewLeadsDialogOpen(true)
        } else if (setting === 'saveAsTemplate') {
            if (canvas.isDirty) {
                enqueueSnackbar({
                    message: 'Please save the flow before exporting as template',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                return
            }
            setExportAsTemplateDialogProps({
                title: 'Export As Template',
                chatflow: chatflow
            })
            setExportAsTemplateDialogOpen(true)
        } else if (setting === 'chatflowConfiguration') {
            setChatflowConfigurationDialogProps({
                title: 'Configuration',
                chatflow: chatflow
            })
            setChatflowConfigurationDialogOpen(true)
        } else if (setting === 'duplicateChatflow') {
            // Handle duplicate functionality
            enqueueSnackbar({
                message: 'Duplicate functionality will be implemented',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'info'
                }
            })
        } else if (setting === 'loadChatflow') {
            // Handle load functionality
            enqueueSnackbar({
                message: 'Load functionality will be implemented',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'info'
                }
            })
        } else if (setting === 'exportChatflow') {
            // Handle export functionality
            enqueueSnackbar({
                message: 'Export functionality will be implemented',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'info'
                }
            })
        }
    }

    const handleDeleteFlow = async () => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete ${canvasTitle} ${chatflow.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                await chatflowsApi.deleteChatflow(chatflow.id)
                localStorage.removeItem(`${chatflow.id}_INTERNAL`)
                navigate('/agentflows')
            } catch (error) {
                enqueueSnackbar({
                    message: typeof error.response.data === 'object' ? error.response.data.message : error.response.data,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        }
    }

    const onConfirmSaveName = (flowName) => {
        setFlowDialogOpen(false)
        handleSaveFlow(flowName)
    }

    const handleSaveFlow = (chatflowName) => {
        if (reactFlowInstance) {
            const nodes = reactFlowInstance.getNodes().map((node) => {
                const nodeData = cloneDeep(node.data)
                            if (Object.prototype.hasOwnProperty.call(nodeData.inputs, DTAMIND_CREDENTIAL_ID)) {
                nodeData.credential = nodeData.inputs[DTAMIND_CREDENTIAL_ID]
                nodeData.inputs = omit(nodeData.inputs, [DTAMIND_CREDENTIAL_ID])
                }
                node.data = {
                    ...nodeData,
                    selected: false,
                    status: undefined
                }
                return node
            })

            const rfInstanceObject = reactFlowInstance.toObject()
            rfInstanceObject.nodes = nodes
            const flowData = JSON.stringify(rfInstanceObject)

            if (!chatflow.id) {
                const newChatflowBody = {
                    name: chatflowName,
                    deployed: false,
                    isPublic: false,
                    flowData,
                    type: 'AGENTFLOW'
                }
                createNewChatflowApi.request(newChatflowBody)
            } else {
                const updateBody = {
                    name: chatflowName,
                    flowData
                }
                updateChatflowApi.request(chatflow.id, updateBody)
            }
        }
    }

    // eslint-disable-next-line
    const onNodeClick = useCallback((event, clickedNode) => {
        setSelectedNode(clickedNode)
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === clickedNode.id) {
                    node.data = {
                        ...node.data,
                        selected: true
                    }
                } else {
                    node.data = {
                        ...node.data,
                        selected: false
                    }
                }

                return node
            })
        )
    })

    // eslint-disable-next-line
    const onNodeDoubleClick = useCallback((event, node) => {
        if (!node || !node.data) return
        if (node.data.name === 'stickyNoteAgentflow') {
            // dont show dialog
        } else {
            const dialogProps = {
                data: node.data,
                inputParams: node.data.inputParams.filter((inputParam) => !inputParam.hidden)
            }

            setEditNodeDialogProps(dialogProps)
            setEditNodeDialogOpen(true)
        }
    })

    const onDragOver = useCallback((event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event) => {
            event.preventDefault()
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            let nodeData = event.dataTransfer.getData('application/reactflow')

            // check if the dropped element is valid
            if (typeof nodeData === 'undefined' || !nodeData) {
                return
            }

            nodeData = JSON.parse(nodeData)

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left - 100,
                y: event.clientY - reactFlowBounds.top - 50
            })
            const nodes = reactFlowInstance.getNodes()

            if (nodeData.name === 'startAgentflow' && nodes.find((node) => node.data.name === 'startAgentflow')) {
                enqueueSnackbar({
                    message: 'Only one start node is allowed',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                return
            }

            const newNodeId = getUniqueNodeId(nodeData, reactFlowInstance.getNodes())
            const newNodeLabel = getUniqueNodeLabel(nodeData, nodes)

            const newNode = {
                id: newNodeId,
                position,
                data: { ...initNode(nodeData, newNodeId, true), label: newNodeLabel }
            }

            if (nodeData.type === 'Iteration') {
                newNode.type = 'iteration'
            } else if (nodeData.type === 'StickyNote') {
                newNode.type = 'stickyNote'
            } else {
                newNode.type = 'agentFlow'
            }

            // Check if the dropped node is within any Iteration node's flowContainerSize
            const iterationNodes = nodes.filter((node) => node.type === 'iteration')
            let parentNode = null

            for (const iterationNode of iterationNodes) {
                // Get the iteration node's position and dimensions
                const nodeWidth = iterationNode.width || 300
                const nodeHeight = iterationNode.height || 250

                // Calculate the boundaries of the iteration node
                const nodeLeft = iterationNode.position.x
                const nodeRight = nodeLeft + nodeWidth
                const nodeTop = iterationNode.position.y
                const nodeBottom = nodeTop + nodeHeight

                // Check if the dropped position is within these boundaries
                if (position.x >= nodeLeft && position.x <= nodeRight && position.y >= nodeTop && position.y <= nodeBottom) {
                    parentNode = iterationNode

                    // We can't have nested iteration nodes
                    if (nodeData.name === 'iterationAgentflow') {
                        enqueueSnackbar({
                            message: 'Nested iteration node is not supported yet',
                            options: {
                                key: new Date().getTime() + Math.random(),
                                variant: 'error',
                                persist: true,
                                action: (key) => (
                                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                        <IconX />
                                    </Button>
                                )
                            }
                        })
                        return
                    }

                    // We can't have human input node inside iteration node
                    if (nodeData.name === 'humanInputAgentflow') {
                        enqueueSnackbar({
                            message: 'Human input node is not supported inside Iteration node',
                            options: {
                                key: new Date().getTime() + Math.random(),
                                variant: 'error',
                                persist: true,
                                action: (key) => (
                                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                        <IconX />
                                    </Button>
                                )
                            }
                        })
                        return
                    }
                    break
                }
            }

            // If the node is dropped inside an iteration node, set its parent
            if (parentNode) {
                newNode.parentNode = parentNode.id
                newNode.extent = 'parent'
                // Adjust position to be relative to the parent
                newNode.position = {
                    x: position.x - parentNode.position.x,
                    y: position.y - parentNode.position.y
                }
            }

            setSelectedNode(newNode)
            setNodes((nds) => {
                return (nds ?? []).concat(newNode).map((node) => {
                    if (node.id === newNode.id) {
                        node.data = {
                            ...node.data,
                            selected: true
                        }
                    } else {
                        node.data = {
                            ...node.data,
                            selected: false
                        }
                    }

                    return node
                })
            })
            setTimeout(() => setDirty(), 0)
        },

        // eslint-disable-next-line
        [reactFlowInstance]
    )

    const syncNodes = () => {
        const componentNodes = canvas.componentNodes

        const cloneNodes = cloneDeep(nodes)
        const cloneEdges = cloneDeep(edges)
        let toBeRemovedEdges = []

        for (let i = 0; i < cloneNodes.length; i++) {
            const node = cloneNodes[i]
            const componentNode = componentNodes.find((cn) => cn.name === node.data.name)
            if (componentNode && componentNode.version > node.data.version) {
                const clonedComponentNode = cloneDeep(componentNode)
                cloneNodes[i].data = updateOutdatedNodeData(clonedComponentNode, node.data, true)
                toBeRemovedEdges.push(...updateOutdatedNodeEdge(cloneNodes[i].data, cloneEdges))
            }
        }

        setNodes(cloneNodes)
        setEdges(cloneEdges.filter((edge) => !toBeRemovedEdges.includes(edge)))
        setDirty()
        setIsSyncNodesButtonEnabled(false)
    }

    const { reward: confettiReward } = useReward('canvasConfetti', 'confetti', {
        elementCount: 150,
        spread: 80,
        lifetime: 300,
        startVelocity: 40,
        zIndex: 10000,
        decay: 0.92,
        position: 'fixed'
    })

    const triggerConfetti = () => {
        setTimeout(() => {
            confettiReward()
        }, 50)
    }

    const saveChatflowSuccess = () => {
        dispatch({ type: REMOVE_DIRTY })
        enqueueSnackbar({
            message: `${canvasTitle} saved`,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    const errorFailed = (message) => {
        enqueueSnackbar({
            message,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'error',
                persist: true,
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    const setDirty = () => {
        dispatch({ type: SET_DIRTY })
    }

    const checkIfSyncNodesAvailable = (nodes) => {
        const componentNodes = canvas.componentNodes

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            const componentNode = componentNodes.find((cn) => cn.name === node.data.name)
            if (componentNode && componentNode.version > node.data.version) {
                setIsSyncNodesButtonEnabled(true)
                return
            }
        }

        setIsSyncNodesButtonEnabled(false)
    }

    // ==============================|| useEffect ||============================== //

    // Get specific chatflow successful
    useEffect(() => {
        if (getSpecificChatflowApi.data) {
            const chatflow = getSpecificChatflowApi.data
            const initialFlow = chatflow.flowData ? JSON.parse(chatflow.flowData) : []
            setNodes(initialFlow.nodes || [])
            setEdges(initialFlow.edges || [])
            dispatch({ type: SET_CHATFLOW, chatflow })
        } else if (getSpecificChatflowApi.error) {
            errorFailed(`Failed to retrieve ${canvasTitle}: ${getSpecificChatflowApi.error.response.data.message}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificChatflowApi.data, getSpecificChatflowApi.error])

    // Create new chatflow successful
    useEffect(() => {
        if (createNewChatflowApi.data) {
            const chatflow = createNewChatflowApi.data
            dispatch({ type: SET_CHATFLOW, chatflow })
            saveChatflowSuccess()
            window.history.replaceState(state, null, `/v2/agentcanvas/${chatflow.id}`)
        } else if (createNewChatflowApi.error) {
            errorFailed(`Failed to save ${canvasTitle}: ${createNewChatflowApi.error.response.data.message}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createNewChatflowApi.data, createNewChatflowApi.error])

    // Update chatflow successful
    useEffect(() => {
        if (updateChatflowApi.data) {
            dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data })
            saveChatflowSuccess()
        } else if (updateChatflowApi.error) {
            errorFailed(`Failed to save ${canvasTitle}: ${updateChatflowApi.error.response.data.message}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateChatflowApi.data, updateChatflowApi.error])

    useEffect(() => {
        setChatflow(canvasDataStore.chatflow)
        if (canvasDataStore.chatflow) {
            const flowData = canvasDataStore.chatflow.flowData ? JSON.parse(canvasDataStore.chatflow.flowData) : []
            checkIfSyncNodesAvailable(flowData.nodes || [])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasDataStore.chatflow])

    // Initialization
    useEffect(() => {
        setIsSyncNodesButtonEnabled(false)
        if (chatflowId) {
            getSpecificChatflowApi.request(chatflowId)
        } else {
            if (localStorage.getItem('duplicatedFlowData')) {
                handleLoadFlow(localStorage.getItem('duplicatedFlowData'))
                setTimeout(() => localStorage.removeItem('duplicatedFlowData'), 0)
            } else {
                setNodes([])
                setEdges([])
            }
            dispatch({
                type: SET_CHATFLOW,
                chatflow: {
                    name: `Untitled ${canvasTitle}`
                }
            })
        }

        getNodesApi.request()

        // Clear dirty state before leaving and remove any ongoing test triggers and webhooks
        return () => {
            setTimeout(() => dispatch({ type: REMOVE_DIRTY }), 0)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setCanvasDataStore(canvas)
    }, [canvas])

    useEffect(() => {
        function handlePaste(e) {
            const pasteData = e.clipboardData.getData('text')
            //TODO: prevent paste event when input focused, temporary fix: catch chatflow syntax
            if (pasteData.includes('{"nodes":[') && pasteData.includes('],"edges":[')) {
                handleLoadFlow(pasteData)
            }
        }

        window.addEventListener('paste', handlePaste)

        return () => {
            window.removeEventListener('paste', handlePaste)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (templateFlowData && templateFlowData.includes('"nodes":[') && templateFlowData.includes('],"edges":[')) {
            handleLoadFlow(templateFlowData)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateFlowData])

    usePrompt('You have unsaved changes! Do you want to navigate away?', canvasDataStore.isDirty)

    const [chatPopupOpen, setChatPopupOpen] = useState(false)

    useEffect(() => {
        if (!chatflowId && !localStorage.getItem('duplicatedFlowData') && getNodesApi.data && nodes.length === 0) {
            const startNodeData = getNodesApi.data.find((node) => node.name === 'startAgentflow')
            if (startNodeData) {
                const clonedStartNodeData = cloneDeep(startNodeData)
                clonedStartNodeData.position = { x: 100, y: 100 }
                const startNode = {
                    id: 'startAgentflow_0',
                    type: 'agentFlow',
                    position: { x: 100, y: 100 },
                    data: {
                        ...initNode(clonedStartNodeData, 'startAgentflow_0', true),
                        label: 'Start'
                    }
                }
                setNodes([startNode])
                setEdges([])
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getNodesApi.data, chatflowId])

    return (
        <>
            <span
                id='canvasConfetti'
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '0',
                    height: '0',
                    zIndex: 9999,
                    pointerEvents: 'none',
                    background: 'transparent'
                }}
            />

            {/* Menu Bar for AgentCanvas */}
            <Box sx={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1200,
                bgcolor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2
            }}>
                {/* Left side - Logo and Sparkle Icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '228px' }}>
                    <Typography variant="h6" sx={{ mr: 2, color: theme.palette.primary.main }}>
                        DTA Mind
                    </Typography>
                    <Logo />
                    {/* Sparkle Icon - Generate Agentflow */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ml: 2,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)'
                            }
                        }}
                        onClick={() => setAgentflowGeneratorOpen(true)}
                        title="Generate Agentflow"
                    >
                        <Box
                            sx={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: '16px',
                                    height: '16px',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {/* Large Star */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: '12px',
                                        height: '12px',
                                        background: 'white',
                                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                                        transform: 'translate(-1px, -1px)'
                                    }}
                                />
                                {/* Small Star */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: '8px',
                                        height: '8px',
                                        background: 'white',
                                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                                        transform: 'translate(2px, 2px)'
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                
                {/* Center - Tab Navigation */}
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{ 
                            height: '64px',
                            '& .MuiTabs-indicator': {
                                height: '3px',
                                borderRadius: '2px',
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                            }
                        }}
                    >
                        <Tab 
                            label="Workflow" 
                            value="workflow" 
                            sx={{ 
                                height: '64px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                color: theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                    fontWeight: 700
                                },
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    background: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: '8px 8px 0 0'
                                }
                            }} 
                        />

                        <Tab 
                            label="Credentials" 
                            value="credentials" 
                            sx={{ 
                                height: '64px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                color: theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                    fontWeight: 700
                                },
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    background: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: '8px 8px 0 0'
                                }
                            }} 
                        />
                        <Tab 
                            label="API Keys" 
                            value="apikey" 
                            sx={{ 
                                height: '64px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                color: theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                    fontWeight: 700
                                },
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    background: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: '8px 8px 0 0'
                                }
                            }} 
                        />
                        <Tab 
                            label="Document Stores" 
                            value="document-stores" 
                            sx={{ 
                                height: '64px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                color: theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                    fontWeight: 700
                                },
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    background: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: '8px 8px 0 0'
                                }
                            }} 
                        />
                        <Tab 
                            label="Templates" 
                            value="templates" 
                            sx={{ 
                                height: '64px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                color: theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                    fontWeight: 700
                                },
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    background: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: '8px 8px 0 0'
                                }
                            }} 
                        />
                        <Tab 
                            label="Schedule" 
                            value="schedule" 
                            sx={{ 
                                height: '64px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                color: theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                    fontWeight: 700
                                },
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    background: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: '8px 8px 0 0'
                                }
                            }} 
                        />
                        <Tab 
                            label="Assistants" 
                            value="assistants" 
                            sx={{ 
                                height: '64px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                color: theme.palette.text.secondary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                    fontWeight: 700
                                },
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    background: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: '8px 8px 0 0'
                                }
                            }} 
                        />
                    </Tabs>
                </Box>
                
                {/* Right side - Save button, Agent title, and User Profile */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '200px', justifyContent: 'flex-end' }}>
                    {/* Agent Title */}
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': {
                                color: theme.palette.primary.main
                            }
                        }}
                        onClick={() => {
                            if (chatflow?.name) {
                                setFlowDialogOpen(true)
                            } else {
                                setFlowDialogOpen(true)
                            }
                        }}
                    >
                        {chatflow?.name || 'Untitled Agent'}
                    </Typography>
                    
                    {/* Save Button */}
                    <ButtonBase
                        sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }
                        }}
                        onClick={() => {
                            if (chatflow?.name && chatflow?.id) {
                                // Update existing chatflow
                                updateChatflowApi.request(chatflow.id, {
                                    ...chatflow,
                                    deployed: false
                                })
                            } else {
                                // Create new chatflow
                                setFlowDialogOpen(true)
                            }
                        }}
                        title="Save Agent"
                    >
                        <IconDeviceFloppy size={20} />
                    </ButtonBase>
                    
                    {/* Settings Button */}
                    <ButtonBase
                        sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: theme.palette.grey[300],
                            color: theme.palette.text.secondary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: theme.palette.grey[400],
                                transform: 'scale(1.05)'
                            }
                        }}
                        onClick={handleSettingsClick}
                        title="Settings"
                    >
                        <IconSettings size={20} />
                    </ButtonBase>

                    {/* Dark Mode Toggle */}
                    <MaterialUISwitch checked={isDark} onChange={changeDarkMode} />

                    {/* User Profile Section */}
                    <ProfileSection handleLogout={signOutClicked} />
                </Box>
            </Box>

            <Box sx={{ pt: '64px', height: '100vh', width: '100%' }}> {/* Adjusted for menu bar */}
                    {/* Left Panel - Add Nodes */}
                    <LeftPanel
                        nodesData={getNodesApi.data}
                        selectedNode={selectedNode}
                        onFlowGenerated={triggerConfetti}
                        onPanelToggle={(isOpen) => {
                            // Update the ReactFlow wrapper margin based on panel state
                            const wrapper = document.querySelector('.reactflow-parent-wrapper')
                            if (wrapper) {
                                wrapper.style.marginLeft = isOpen ? '304px' : '24px'
                            }
                        }}
                    />
                    
                    {/* Tab Content */}
                    {activeTab === 'workflow' && (
                        <div className='reactflow-parent-wrapper' style={{ marginLeft: '304px' }}>
                            <div className='reactflow-wrapper' ref={reactFlowWrapper}>
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onNodeClick={onNodeClick}
                                    onNodeDoubleClick={onNodeDoubleClick}
                                    onEdgesChange={onEdgesChange}
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                    onNodeDragStop={setDirty}
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    onConnect={onConnect}
                                    onInit={setReactFlowInstance}
                                    fitView
                                    deleteKeyCode={canvas.canvasDialogShow ? null : ['Delete']}
                                    minZoom={0.5}
                                    snapGrid={[25, 25]}
                                    snapToGrid={isSnappingEnabled}
                                    connectionLineComponent={ConnectionLine}
                                >
                                    <Controls
                                        className={customization.isDarkMode ? 'dark-mode-controls' : ''}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        <button
                                            className='react-flow__controls-button react-flow__controls-interactive'
                                            onClick={() => {
                                                setIsSnappingEnabled(!isSnappingEnabled)
                                            }}
                                            title='toggle snapping'
                                            aria-label='toggle snapping'
                                        >
                                            {isSnappingEnabled ? <IconMagnetFilled /> : <IconMagnetOff />}
                                        </button>
                                    </Controls>
                                    <MiniMap
                                        nodeStrokeWidth={3}
                                        nodeColor={customization.isDarkMode ? '#2d2d2d' : '#e2e2e2'}
                                        nodeStrokeColor={customization.isDarkMode ? '#525252' : '#fff'}
                                        maskColor={customization.isDarkMode ? 'rgb(45, 45, 45, 0.6)' : 'rgb(240, 240, 240, 0.6)'}
                                        style={{
                                            backgroundColor: customization.isDarkMode ? theme.palette.background.default : '#fff'
                                        }}
                                    />
                                    <Background color='#aaa' gap={16} />
                                    <EditNodeDialog
                                        show={editNodeDialogOpen}
                                        dialogProps={editNodeDialogProps}
                                        onCancel={() => setEditNodeDialogOpen(false)}
                                    />
                                    {isSyncNodesButtonEnabled && (
                                        <Fab
                                            sx={{
                                                left: 60,
                                                top: 20,
                                                color: 'white',
                                                background: 'orange',
                                                '&:hover': {
                                                    background: 'orange',
                                                    backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`
                                                }
                                            }}
                                            size='small'
                                            aria-label='sync'
                                            title='Sync Nodes'
                                            onClick={() => syncNodes()}
                                        >
                                            <IconRefreshAlert />
                                        </Fab>
                                    )}
                                    <ChatPopUp isAgentCanvas={true} chatflowid={chatflowId} onOpenChange={setChatPopupOpen} />
                                    {!chatPopupOpen && <ValidationPopUp isAgentCanvas={true} chatflowid={chatflowId} />}
                                </ReactFlow>
                            </div>
                        </div>
                    )}

                    {activeTab === 'configuration' && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                                Configuration
                            </Typography>
                            <Grid container spacing={3}>
                                {/* API Keys Section */}
                                <Grid item xs={12} md={4}>
                                    <Card 
                                        sx={{ 
                                            height: '100%', 
                                            cursor: 'pointer', 
                                            '&:hover': { boxShadow: 3 },
                                            transition: 'box-shadow 0.3s ease-in-out'
                                        }}
                                        onClick={() => navigate('/apikey')}
                                    >
                                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                            <IconKey size={48} style={{ marginBottom: '16px', color: theme.palette.primary.main }} />
                                            <Typography variant="h6" gutterBottom>
                                                API Keys
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Manage your API keys and external service connections
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Credentials Section */}
                                <Grid item xs={12} md={4}>
                                    <Card 
                                        sx={{ 
                                            height: '100%', 
                                            cursor: 'pointer', 
                                            '&:hover': { boxShadow: 3 },
                                            transition: 'box-shadow 0.3s ease-in-out'
                                        }}
                                        onClick={() => navigate('/credentials')}
                                    >
                                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                            <IconShield size={48} style={{ marginBottom: '16px', color: theme.palette.primary.main }} />
                                            <Typography variant="h6" gutterBottom>
                                                Credentials
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Secure storage for your authentication credentials
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Document Store Section */}
                                <Grid item xs={12} md={4}>
                                    <Card 
                                        sx={{ 
                                            height: '100%', 
                                            cursor: 'pointer', 
                                            '&:hover': { boxShadow: 3 },
                                            transition: 'box-shadow 0.3s ease-in-out'
                                        }}
                                        onClick={() => navigate('/document-stores')}
                                    >
                                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                            <IconDatabase size={48} style={{ marginBottom: '16px', color: theme.palette.primary.main }} />
                                            <Typography variant="h6" gutterBottom>
                                                Document Store
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Manage your document collections and storage
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {activeTab === 'templates' && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                                Templates
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card 
                                        sx={{ 
                                            height: '100%', 
                                            cursor: 'pointer', 
                                            '&:hover': { boxShadow: 3 },
                                            transition: 'box-shadow 0.3s ease-in-out'
                                        }}
                                        onClick={() => navigate('/templates')}
                                    >
                                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Workflow Templates
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Access and manage your workflow templates
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {activeTab === 'schedule' && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h4" gutterBottom>Schedule</Typography>
                            <Typography variant="body1" gutterBottom>Schedule your workflows</Typography>
                        </Box>
                    )}

                    {activeTab === 'assistants' && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h4" gutterBottom>Assistants</Typography>
                            <Typography variant="body1" gutterBottom>Manage your AI assistants</Typography>
                        </Box>
                    )}

                    {activeTab === 'agents' && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h4" gutterBottom>Agents</Typography>
                            <Typography variant="body1" gutterBottom>Manage your AI agents</Typography>
                        </Box>
                    )}

                    {activeTab === 'chatbot' && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h4" gutterBottom>Chatbot</Typography>
                            <Typography variant="body1" gutterBottom>Configure your chatbot settings</Typography>
                        </Box>
                    )}
                </Box>
                <SaveChatflowDialog
                    show={flowDialogOpen}
                    dialogProps={{
                        title: 'Save New Agent',
                        confirmButtonName: 'Save',
                        cancelButtonName: 'Cancel'
                    }}
                    onCancel={() => setFlowDialogOpen(false)}
                    onConfirm={onConfirmSaveName}
                />
                <AgentflowGeneratorDialog
                    show={agentflowGeneratorOpen}
                    dialogProps={{
                        title: 'What would you like to build?',
                        description: 'Enter your prompt to generate an agentflow. Performance may vary with different models. Only nodes and edges are generated, you will need to fill in the input fields for each node.'
                    }}
                    onCancel={() => setAgentflowGeneratorOpen(false)}
                    onConfirm={() => {
                        setAgentflowGeneratorOpen(false)
                        // Handle the generated flow here
                        enqueueSnackbar('Agentflow generation completed!', { variant: 'success' })
                    }}
                />
                
                {/* Settings Dropdown */}
                <Settings
                    chatflow={chatflow}
                    isSettingsOpen={isSettingsOpen}
                    isAgentCanvas={true}
                    anchorEl={settingsAnchorEl}
                    onSettingsItemClick={handleSettingsItemClick}
                    onClose={handleSettingsClose}
                />
                
                {/* Settings Dialogs */}
                <ViewMessagesDialog
                    show={viewMessagesDialogOpen}
                    dialogProps={viewMessagesDialogProps}
                    onCancel={() => setViewMessagesDialogOpen(false)}
                />
                <ViewLeadsDialog 
                    show={viewLeadsDialogOpen} 
                    dialogProps={viewLeadsDialogProps} 
                    onCancel={() => setViewLeadsDialogOpen(false)} 
                />
                <ChatflowConfigurationDialog
                    key='chatflowConfiguration'
                    show={chatflowConfigurationDialogOpen}
                    dialogProps={chatflowConfigurationDialogProps}
                    onCancel={() => setChatflowConfigurationDialogOpen(false)}
                    isAgentCanvas={true}
                />
                <ExportAsTemplateDialog
                    show={exportAsTemplateDialogOpen}
                    dialogProps={exportAsTemplateDialogProps}
                    onCancel={() => setExportAsTemplateDialogOpen(false)}
                />
                
                <ConfirmDialog />
        </>
    )
}

export default AgentflowCanvas

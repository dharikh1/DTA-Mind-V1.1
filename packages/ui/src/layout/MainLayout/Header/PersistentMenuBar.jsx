import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { Box, Tabs, Tab, Typography } from '@mui/material'
import { IconSparkles } from '@tabler/icons-react'
import Logo from '@/ui-component/extended/Logo'

const PersistentMenuBar = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    
    // Determine active tab based on current route
    const getActiveTab = () => {
        const path = location.pathname
        if (path === '/' || path === '/v2/agentcanvas' || path.includes('/canvas')) return 'workflow'
        if (path === '/agent') return 'agents'
        if (path === '/credentials') return 'credentials'
        if (path === '/apikey') return 'apikey'
        if (path === '/document-stores') return 'document-stores'
        if (path === '/templates') return 'templates'
        if (path === '/schedule') return 'schedule'
        if (path === '/assistants') return 'assistants'
        return 'workflow'
    }

    const [activeTab, setActiveTab] = useState(getActiveTab())

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
        
        // Navigate to specific pages for certain tabs
        if (newValue === 'templates') {
            navigate('/templates')
        } else if (newValue === 'schedule') {
            navigate('/schedule')
        } else if (newValue === 'assistants') {
            navigate('/assistants')
        } else if (newValue === 'agents') {
            navigate('/agent')
        } else if (newValue === 'credentials') {
            navigate('/credentials')
        } else if (newValue === 'apikey') {
            navigate('/apikey')
        } else if (newValue === 'document-stores') {
            navigate('/document-stores')
        } else if (newValue === 'workflow') {
            navigate('/v2/agentcanvas')
        }
    }

    const handleAgentflowGeneration = () => {
        // This will be handled by the parent component or context
        console.log('Generate Agentflow clicked')
    }

    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            height: '64px',
            px: 2,
            bgcolor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`
        }}>
            {/* Left side - Logo and Sparkle Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '228px' }}>
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
                    onClick={handleAgentflowGeneration}
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
                        label="Agents" 
                        value="agents" 
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
            
            {/* Right side - Empty space for now */}
            <Box sx={{ width: '200px' }} />
        </Box>
    )
}

export default PersistentMenuBar

import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { IconRobot } from '@tabler/icons-react'

// ==============================|| LOGO ||============================== //

const Logo = () => {
    const customization = useSelector((state) => state.customization)

    return (
        <Box 
            sx={{ 
                alignItems: 'center', 
                display: 'flex', 
                flexDirection: 'row', 
                marginLeft: '10px',
                gap: 1.5
            }}
        >
            <IconRobot 
                size={40} 
                color={customization.isDarkMode ? '#ffffff' : '#1976d2'} 
            />
            <Typography 
                variant="h3" 
                sx={{ 
                    fontWeight: 700,
                    color: customization.isDarkMode ? '#ffffff' : '#1976d2',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                }}
            >
                DTA Mind
            </Typography>
        </Box>
    )
}

export default Logo

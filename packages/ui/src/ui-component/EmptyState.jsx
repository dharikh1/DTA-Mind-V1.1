import React from 'react'
import PropTypes from 'prop-types'
import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const EmptyState = ({ icon: Icon, title, description, iconSize = 120, iconColor = '#6B7280' }) => {
    const theme = useTheme()

    return (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
            <Box sx={{ p: 2, height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon 
                    size={iconSize} 
                    color={iconColor}
                    style={{ 
                        opacity: 0.6,
                        filter: theme.palette.mode === 'dark' ? 'brightness(0.8)' : 'brightness(1)'
                    }}
                />
            </Box>
            <Typography 
                variant="h6" 
                sx={{ 
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    mb: 0.5
                }}
            >
                {title}
            </Typography>
            {description && (
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: theme.palette.text.disabled,
                        textAlign: 'center'
                    }}
                >
                    {description}
                </Typography>
            )}
        </Stack>
    )
}

EmptyState.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string
}

export default EmptyState

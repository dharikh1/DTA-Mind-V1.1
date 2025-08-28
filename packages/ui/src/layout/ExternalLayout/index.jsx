import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material'

// project imports
import Header from '@/layout/MainLayout/Header'
import { headerHeight } from '@/store/constant'
import { SET_MENU } from '@/store/actions'

// styles
const Main = styled('main')(({ theme }) => ({
    ...theme.typography.mainContent,
    backgroundColor: 'transparent',
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
    paddingTop: `${headerHeight}px`
}))

// ==============================|| EXTERNAL LAYOUT ||============================== //

const ExternalLayout = () => {
    const theme = useTheme()
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'))
    const dispatch = useDispatch()

    useEffect(() => {
        // Always close the sidebar for external pages
        dispatch({ type: SET_MENU, opened: false })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* header */}
            <AppBar
                enableColorOnDark
                position='fixed'
                color='inherit'
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    width: '100%'
                }}
            >
                <Toolbar sx={{ height: `${headerHeight}px`, borderBottom: '1px solid', borderColor: theme.palette.grey[900] + 25 }}>
                    <Header handleLeftDrawerToggle={() => {}} />
                </Toolbar>
            </AppBar>

            {/* main content - full width without sidebar */}
            <Main theme={theme}>
                <Outlet />
            </Main>
        </Box>
    )
}

export default ExternalLayout

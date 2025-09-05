// material-ui
import { styled } from '@mui/material/styles'

// project imports
import MainCard from './MainCard'

const NodeCardWrapper = styled(MainCard)(({ theme }) => ({
    background: 'transparent',
    color: theme.darkTextPrimary,
    border: 'none',
    width: 'auto',
    height: 'auto',
    padding: '0',
    boxShadow: 'none',
    '&:hover': {
        boxShadow: 'none'
    }
}))

export default NodeCardWrapper

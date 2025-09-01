// constant
import {
    IconArrowsSplit,
    IconPlayerPlayFilled,
    IconSparkles,
    IconRobot,
    IconReplaceUser,
    IconRepeat,
    IconMessageCircleFilled,
    IconFunctionFilled,
    IconTools,
    IconLibrary,
    IconSubtask,
    IconNote,
    IconWorld,
    IconRelationOneToManyFilled,
    IconVectorBezier2
} from '@tabler/icons-react'

export const gridSpacing = 3
export const drawerWidth = 260
export const appDrawerWidth = 320
export const headerHeight = 80
export const maxScroll = 100000
export const baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin
export const uiBaseURL = import.meta.env.VITE_UI_BASE_URL || window.location.origin
export const DTAMIND_CREDENTIAL_ID = 'DTAMIND_CREDENTIAL_ID'
export const REDACTED_CREDENTIAL_VALUE = '_DTAMIND_BLANK_07167752-1a71-43b1-bf8f-4f32252165db'
export const ErrorMessage = {
    INVALID_MISSING_TOKEN: 'Invalid or Missing token',
    TOKEN_EXPIRED: 'Token Expired',
    REFRESH_TOKEN_EXPIRED: 'Refresh Token Expired',
    FORBIDDEN: 'Forbidden',
    UNKNOWN_USER: 'Unknown Username or Password',
    INCORRECT_PASSWORD: 'Incorrect Password',
    INACTIVE_USER: 'Inactive User',
    INVALID_WORKSPACE: 'No Workspace Assigned',
    UNKNOWN_ERROR: 'Unknown Error'
}
export const AGENTFLOW_ICONS = [
    {
        name: 'conditionAgentflow',
        icon: IconArrowsSplit,
        color: '#4CAF50'
    },
    {
        name: 'startAgentflow',
        icon: IconPlayerPlayFilled,
        color: '#2196F3'
    },
    {
        name: 'llmAgentflow',
        icon: IconSparkles,
        color: '#9C27B0'
    },
    {
        name: 'agentAgentflow',
        icon: IconRobot,
        color: '#FF9800'
    },
    {
        name: 'humanInputAgentflow',
        icon: IconReplaceUser,
        color: '#F44336'
    },
    {
        name: 'loopAgentflow',
        icon: IconRepeat,
        color: '#795548'
    },
    {
        name: 'directReplyAgentflow',
        icon: IconMessageCircleFilled,
        color: '#607D8B'
    },
    {
        name: 'customFunctionAgentflow',
        icon: IconFunctionFilled,
        color: '#E91E63'
    },
    {
        name: 'toolAgentflow',
        icon: IconTools,
        color: '#00BCD4'
    },
    {
        name: 'retrieverAgentflow',
        icon: IconLibrary,
        color: '#8BC34A'
    },
    {
        name: 'conditionAgentAgentflow',
        icon: IconSubtask,
        color: '#FF5722'
    },
    {
        name: 'stickyNoteAgentflow',
        icon: IconNote,
        color: '#FFC107'
    },
    {
        name: 'httpAgentflow',
        icon: IconWorld,
        color: '#3F51B5'
    },
    {
        name: 'iterationAgentflow',
        icon: IconRelationOneToManyFilled,
        color: '#009688'
    },
    {
        name: 'executeFlowAgentflow',
        icon: IconVectorBezier2,
        color: '#673AB7'
    }
]

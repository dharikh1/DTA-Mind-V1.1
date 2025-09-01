import React from 'react'
import PropTypes from 'prop-types'

// Custom styled icon component
const StyledIcon = ({ icon: Icon, backgroundColor, size = 30 }) => {
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '8px',
                backgroundColor: backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <Icon size={size * 0.6} color="white" strokeWidth={2} />
        </div>
    )
}

StyledIcon.propTypes = {
    icon: PropTypes.elementType.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    size: PropTypes.number
}

export default StyledIcon

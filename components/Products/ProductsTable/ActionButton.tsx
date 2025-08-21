import React from 'react'

interface ActionButtonProps {
  action: string
  onClick: () => void
}

const ActionButton = React.memo(({ action, onClick }: ActionButtonProps) => {
  const getButtonClass = () => {
    switch (action) {
      case 'Edit':
        return 'is-info'
      case 'Delete':
        return 'is-danger'
      default:
        return 'is-link'
    }
  }

  return (
    <button 
      className={`button is-small is-size-7 ${getButtonClass()}`}
      onClick={onClick}
    >
      {action}
    </button>
  )
})

ActionButton.displayName = 'ActionButton'

export default ActionButton 
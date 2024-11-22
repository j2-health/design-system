import React from 'react'
import { ConfigProvider } from 'antd'
import { IconContext } from '@phosphor-icons/react'
import { appTheme } from './appTheme'

export const AppConfigProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ConfigProvider theme={appTheme}>
      <IconContext.Provider value={{ weight: 'duotone', size: 16 }}>
        {children}
      </IconContext.Provider>
    </ConfigProvider>
  )
}

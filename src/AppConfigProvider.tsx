import { ConfigProvider } from 'antd'
import { appTheme } from './appTheme'

export const AppConfigProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <ConfigProvider theme={appTheme}>{children}</ConfigProvider>
}

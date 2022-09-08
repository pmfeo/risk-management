import './Layout.module.scss'

interface Props {
  children: React.ReactNode
}

function Layout ({ children }: Props): JSX.Element {
  return <div className="container">{children}</div>
}

export default Layout

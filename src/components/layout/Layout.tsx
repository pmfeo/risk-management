import Container from 'react-bootstrap/Container'

interface Props {
  children: React.ReactNode
}

function Layout ({ children }: Props): JSX.Element {
  return <Container>{children}</Container>
}

export default Layout

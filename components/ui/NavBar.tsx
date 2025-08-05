import Image from 'next/image'
import Link from 'next/link'
import NavItem from './NavItem'

const NavBar = () => (
  <nav 
    className="navbar is-white" 
    role="navigation" 
    aria-label="main navigation"
    style={{
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      borderBottom: '1px solid #e8e8e8'
    }}
  >
    <div className="navbar-brand">
      <Link href="/" className="navbar-item">
        <Image src="/images/husble.png" alt="husble" width={100} height={100} />
      </Link>
    </div>
    <div className="navbar-menu">
      <NavItem />
    </div>
  </nav>
)

export default NavBar
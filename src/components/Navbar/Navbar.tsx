import "./Navbar.scss"
import CustomNavLink from "./CustomNavLink"
import UserProfile from "../User/UserProfile"

const Navbar = () => {
  const loggedIn = false

  return (
    <header>
      <span>Audio API</span>
      <CustomNavLink to="" linkText="Search" />
      <CustomNavLink to="/queue" linkText="Queue" />
      <CustomNavLink to="/settings" linkText="Settings" />
      {loggedIn ? (
        <UserProfile />
      ) : (
        <CustomNavLink to="/login" linkText="Login" className="login-link" />
      )}
    </header>
  )
}

export default Navbar

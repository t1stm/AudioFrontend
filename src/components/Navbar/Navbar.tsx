import "./Navbar.scss"
import CustomNavLink from "./CustomNavLink"
import UserProfile from "../User/UserProfile"

const Navbar = () => {
  const loggedIn = false;

  return (
    <header>
      <span>Audio API</span>
      <CustomNavLink href="/" linkText="Search" />
      <CustomNavLink href="/queue" linkText="Queue" />
      <CustomNavLink href="/settings" linkText="Settings" />
      {loggedIn ?
        <UserProfile /> :
        <CustomNavLink href="/login" linkText="Login" className="login-link" />
      }
    </header>
  );
}

export default Navbar;
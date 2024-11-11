import "./Navbar.scss"
import CustomNavLink from "./CustomNavLink"
import UserProfile from "../User/UserProfile"

const Navbar = () => {
  const loggedIn = false

  return (
    <header>
      <span>Audio API</span>
      <CustomNavLink to="" linkText="Search" />
      <CustomNavLink to={"/queue"} linkText="Queue" />
      <CustomNavLink to={"/settings"} linkText="Settings" />
      <CustomNavLink to={"/rooms"} linkText="Rooms" className="rooms-link" />
      <CustomNavLink to={"/chat"} linkText="Chat" className="chat-link" />
      {loggedIn ? (
        <UserProfile />
      ) : (
        <CustomNavLink to={"/login"} linkText="Login" />
      )}
    </header>
  )
}

export default Navbar

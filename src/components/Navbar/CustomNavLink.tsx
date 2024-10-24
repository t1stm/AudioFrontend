import { NavLink } from "react-router-dom"

interface CustomNavLinkProps {
  to: string
  linkText: string
  className?: string
}

const CustomNavLink = ({ to, linkText, className }: CustomNavLinkProps) => {
  const classes = `${className ?? ""} link `

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? classes + "link-active" : classes
      }
    >
      {linkText}
    </NavLink>
  )
}

export default CustomNavLink

import { NavLink } from "react-router-dom"

interface CustomNavLinkProps {
  href: string;
  linkText: string;
  className?: string;
}

const CustomNavLink =
  ({href, linkText, className}: CustomNavLinkProps) => {
  const classes = `${className ?? ""} link `;

  return (
    <NavLink  to={href} className={
      ({isActive}) => isActive ? classes + "link-active" : classes}>
      {linkText}
    </NavLink>
  );
}

export default CustomNavLink;
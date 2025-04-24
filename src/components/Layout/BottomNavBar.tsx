
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, CheckSquare } from "lucide-react";

const navItems = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/employees",
    icon: Users,
    label: "Employees",
  },
  {
    to: "/projects",
    icon: Briefcase,
    label: "Projects",
  },
  {
    to: "/tasks",
    icon: CheckSquare,
    label: "Tasks",
  },
];

export default function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg flex justify-between px-4 py-1 md:hidden">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center flex-1 py-2 px-2 text-xs transition-colors ${
              isActive
                ? "text-dashboard-blue font-semibold"
                : "text-gray-400 hover:text-dashboard-blue"
            }`
          }
        >
          <Icon size={24} />
          <span className="mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Building2,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white dark:bg-gray-800 min-h-screen p-4 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-primary">UniLink</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav className="space-y-2">
        <NavLink
          to="/companies"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-lg ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`
          }
        >
          <Building2 className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Companies</span>}
        </NavLink>
        {/* <NavLink
          to="/roles"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-lg ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`
          }
        >
          <Briefcase className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Roles</span>}
        </NavLink> */}
        <NavLink
          to="/candidates"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-lg ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`
          }
        >
          <Users className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Candidates</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

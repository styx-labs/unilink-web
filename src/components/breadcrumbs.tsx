import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadCrumbsProps {
  items: BreadcrumbItem[];
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary-dark"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadCrumbs;

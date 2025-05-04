import { TaskPriority } from "@/types/Task";

// Component for priority badge
const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colorMap = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${colorMap[priority]}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

export { PriorityBadge };

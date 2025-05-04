// Helper functions
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

const formatDate = (date?: Date): string => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export { generateId, formatDate };

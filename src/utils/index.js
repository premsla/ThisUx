// Format a JS Date to "dd-MMM-yyyy"
export const formatDate = (date) => {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Format an ISO string to "YYYY-MM-DD"
export function dateFormatter(dateString) {
  const inputDate = new Date(dateString);
  if (isNaN(inputDate)) return "Invalid Date";
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Get initials from full name
export function getInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';
  const names = fullName.trim().split(/\s+/);
  const initials = names.slice(0, 2).map(name => name[0].toUpperCase());
  return initials.join('');
}

// Update URL query param 'search'
export const updateURL = ({ searchTerm, navigate, location }) => {
  const params = new URLSearchParams();
  if (searchTerm) params.set('search', searchTerm);
  const newURL = `${location?.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });
  return newURL;
};

// Styles by priority
export const PRIOTITYSTYELS = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
};

// Background colors by task stage
export const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

// Default background options
export const BGS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
];

// Count completed subtasks
export function getCompletedSubTasks(items) {
  return items?.filter(item => item?.isCompleted).length || 0;
}

// Count tasks by stage
export function countTasksByStage(tasks) {
  let inProgressCount = 0, todoCount = 0, completedCount = 0;
  tasks?.forEach(task => {
    switch (task.stage.toLowerCase()) {
      case 'in progress': inProgressCount++; break;
      case 'todo': todoCount++; break;
      case 'completed': completedCount++; break;
      default: break;
    }
  });
  return { inProgress: inProgressCount, todo: todoCount, completed: completedCount };
}
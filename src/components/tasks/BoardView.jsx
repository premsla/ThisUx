import TaskCard from "./TaskCard";

const BoardView = ({ tasks, status }) => {
  // Group tasks by stage
  const todoTasks = tasks?.filter(task => task.stage === "todo") || [];
  const inProgressTasks = tasks?.filter(task => task.stage === "in progress") || [];
  const completedTasks = tasks?.filter(task => task.stage === "completed") || [];

  const TaskColumn = ({ title, tasks, bgColor }) => (
    <div className='w-full'>
      <div className={`w-full h-10 md:h-12 px-4 rounded-md flex items-center justify-center ${bgColor}`}>
        <h4 className='text-white font-semibold text-sm md:text-base'>
          {title} ({tasks.length})
        </h4>
      </div>
      <div className='w-full py-4 space-y-4'>
        {tasks?.map((task, index) => (
          <TaskCard task={task} key={index} />
        ))}
      </div>
    </div>
  );

  // Determine grid columns based on status
  const getGridCols = () => {
    if (status) return 'grid-cols-1'; // Single column for specific status
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'; // All columns for general view
  };

  return (
    <div className={`w-full py-4 grid ${getGridCols()} gap-4 2xl:gap-10`}>
      {(!status || status === "todo") && (
        <TaskColumn
          title="IDEAS"
          tasks={todoTasks}
          bgColor="bg-blue-600"
        />
      )}
      {(!status || status === "in progress") && (
        <TaskColumn
          title="IN PROGRESS"
          tasks={inProgressTasks}
          bgColor="bg-yellow-600"
        />
      )}
      {(!status || status === "completed") && (
        <TaskColumn
          title="DONE"
          tasks={completedTasks}
          bgColor="bg-green-600"
        />
      )}
    </div>
  );
};

export default BoardView;

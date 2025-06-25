import clsx from "clsx";
import React from "react";

import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";


import {
  BGS,
  PRIOTITYSTYELS,
  TASK_TYPE,
  formatDate,
} from "../../utils/index.js";
import UserInfo from "../UserInfo.jsx";
import { TaskColor, TaskDialog } from "./index";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    
      <div className='w-full h-fit bg-gray-700 dark:bg-gray-800 shadow-md p-4 rounded'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
          </div>
          <TaskDialog task={task} />
        </div>
        
          
            <div className='flex items-center gap-2'>
              <TaskColor className={TASK_TYPE[task.stage]} />
              <h4 className='text- line-clamp-1 text-black dark:text-white'>
                {task?.title}
              </h4>
            </div>
          
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            {formatDate(new Date(task?.date))}
          </span>
          {task?.description && (
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-300 line-clamp-2'>{task?.description}</p>
          )}
        

        <div className='w-full border-t border-gray-200 dark:border-gray-700 my-2' />

            
          
      </div>

      
    
  );
};

export default TaskCard;

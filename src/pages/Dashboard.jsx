import clsx from "clsx";
import moment from "moment";
import React, { useEffect } from "react";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Chart, Loading, UserInfo } from "../components";
import { useGetDasboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import { useSelector } from "react-redux";

const Card = ({ label, count, bg, icon }) => {
  return (
    <div className='w-full h-32 bg-white dark:bg-gray-800 p-5 shadow-md dark:shadow-gray-700 rounded-md flex items-center justify-between'>
      <div className='h-full flex flex-1 flex-col justify-between'>
        <p className='text-base text-white'>{label}</p>
        <span className='text-2xl text-white font-white'>{count}</span>
        <span className='text-sm text-gray-400'></span>
      </div>
      <div
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center text-white",
          bg
        )}
      >
        {icon}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, error } = useGetDasboardStatsQuery();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Add error logging for debugging
  useEffect(() => {
    if (error) {
      console.error("Dashboard API Error:", error);
    }
  }, [error]);

  const totals = data?.tasks || [];

  if (isLoading)
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );

  // Add error display
  if (error) {
    return (
      <div className='py-10 text-center'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          <strong className='font-bold'>Error loading dashboard data!</strong>
          <span className='block sm:inline'> {error?.data?.message || error?.message || 'Failed to fetch dashboard statistics'}</span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      _id: "1",
      label: "TOTAL IDEAS",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "DONE",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "IN PROGRESS",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "IDEAS",
      total: totals["todo"],
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]" || 0,
    },
  ];

  return (
    <div className='h-full py-4'>
      <>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
          {stats?.map(({ icon, bg, label, total }, index) => (
            <Card key={index} icon={icon} bg={bg} label={label} count={total} />
          ))}
        </div>

        <div className='w-full bg-white dark:bg-gray-800 my-16 p-4 rounded shadow-sm'>
          <h4 className='text-xl text-gray-500 font-bold mb-2'>
            Chart by Priority
          </h4>
          <Chart data={data?.graphData} />
        </div>
        <div className='w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8'>
          {/* RECENT AUTHORS */}
          {data && <TaskTable tasks={data?.last10Task} />}
          {/* RECENT USERS */}
          {data && user?.isAdmin && <UserTable users={data?.users} />}
        </div>
      </>
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className='text-black dark:text-white  text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Status</th>
        <th className='py-2'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700'>
            <span className='text-center'>{getInitials(user?.name)}</span>
          </div>
          <div>
            <p> {user.name}</p>
            <span className='text-xs text-black'>{user?.role}</span>
          </div>
        </div>
      </td>

      <td>
        <p
          className={clsx(
            "w-fit px-3 py-1 rounded-full text-sm",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </p>
      </td>
      <td className='py-2 text-sm'>{moment(user?.createdAt).fromNow()}</td>
    </tr>
  );

  return (
    <div className='w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded'>
      <table className='w-full mb-5'>
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index + user?._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TaskTable = ({ tasks }) => {
  const { user } = useSelector((state) => state.auth);

  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-800'>
      <tr className='text-black dark:text-white  text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>

        <th className='py-2 hidden md:block'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-800 text-white hover:bg-gray-800/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className='text-base text-white'>
            {task?.title}
          </p>
        </div>
      </td>
      <td className='py-2'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className='capitalize'>{task?.priority}</span>
        </div>
      </td>



      <td className='py-2 hidden md:block'>
        <span className='text-base text-gray-600'>
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <>
      <div
        className={clsx(
          "w-full bg-white dark:bg-[#1f1f1f] px-2 md:px-4 pt-4 pb-4 shadow-md rounded",
          user?.isAdmin ? "md:w-2/3" : ""
        )}
      >
        <table className='w-full '>
          <TableHeader />
          <tbody className=''>
            {tasks.map((task, id) => (
              <TableRow key={task?._id + id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;

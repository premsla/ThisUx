import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { toast } from "sonner";
import {
  AddUser,
  Button,
  ConfirmatioDialog,
  Loading,
  Title,
  UserAction,
} from "../components";
import {
  useDeleteUserMutation,
  useGetTeamListsQuery,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { getInitials, TASK_TYPE, PRIOTITYSTYELS } from "../utils/index";
import { useSearchParams } from "react-router-dom";

const Users = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  const { data, isLoading, refetch } = useGetTeamListsQuery({
    search: searchTerm,
  });

  // Fetch all tasks to show assignments
  const { data: tasksData, isLoading: tasksLoading } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "",
    search: "",
  });

  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected);

      refetch();
      toast.success(res?.data?.message);
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const userActionHandler = async () => {
    try {
      const res = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });

      refetch();
      toast.success(res?.data?.message);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);
    } catch (error) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    refetch();
  }, [open]);

  // Function to get tasks assigned to a specific user
  const getUserTasks = (userId) => {
    if (!tasksData?.tasks) return [];
    return tasksData.tasks.filter(task =>
      task.team && task.team.some(member => member._id === userId)
    );
  };

  // Function to toggle expanded user
  const toggleUserTasks = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className='text-black dark:text-white  text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
        <th className='py-2'>Active</th>
        <th className='py-2'>Assigned Tasks</th>
        <th className='py-2'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    const userTasks = getUserTasks(user._id);
    const isExpanded = expandedUser === user._id;

    return (
      <>
        <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
          <td className='p-2'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
                <span className='text-xs md:text-sm text-center'>
                  {getInitials(user.name)}
                </span>
              </div>
              {user.name}
            </div>
          </td>
          <td className='p-2'>{user.title}</td>
          <td className='p-2'>{user.email}</td>
          <td className='p-2'>{user.role}</td>
          <td>
            <button
              onClick={() => userStatusClick(user)}
              className={clsx(
                "w-fit px-4 py-1 rounded-full",
                user?.isActive ? "bg-blue-200" : "bg-yellow-100"
              )}
            >
              {user?.isActive ? "Active" : "Disabled"}
            </button>
          </td>
          <td className='p-2'>
            <button
              onClick={() => toggleUserTasks(user._id)}
              className='flex items-center gap-2 text-blue-600 hover:text-blue-800'
            >
              <FaTasks />
              <span>{userTasks.length} tasks</span>
              {isExpanded ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </button>
          </td>
          <td className='p-2 flex gap-4 justify-end'>
            <Button
              className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
              label='Edit'
              type='button'
              onClick={() => editClick(user)}
            />

            <Button
              className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
              label='Delete'
              type='button'
              onClick={() => deleteClick(user?._id)}
            />
          </td>
        </tr>
        {isExpanded && (
          <tr>
            <td colSpan="7" className='p-0'>
              <div className='bg-gray-50 dark:bg-gray-800 p-4'>
                <h4 className='font-semibold mb-3 text-gray-700 dark:text-gray-300'>
                  Assigned Tasks ({userTasks.length})
                </h4>
                {userTasks.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {userTasks.map((task) => (
                      <TaskCard key={task._id} task={task} />
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 italic'>No tasks assigned</p>
                )}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  // Task Card Component
  const TaskCard = ({ task }) => (
    <div className='bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600'>
      <div className='flex items-start justify-between mb-2'>
        <h5 className='font-medium text-sm text-gray-800 dark:text-gray-200 truncate'>
          {task.title}
        </h5>
        <span className={clsx(
          'px-2 py-1 text-xs rounded-full',
          TASK_TYPE[task.stage]
        )}>
          {task.stage?.toUpperCase()}
        </span>
      </div>
      <div className='flex items-center justify-between'>
        <span className={clsx(
          'px-2 py-1 text-xs rounded',
          PRIOTITYSTYELS[task.priority]
        )}>
          {task.priority?.toUpperCase()}
        </span>
        <span className='text-xs text-gray-500 dark:text-gray-400'>
          {new Date(task.date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  return isLoading || tasksLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Team Members & Task Assignments' />

          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
            onClick={() => setOpen(true)}
          />
        </div>

        {/* Team Summary */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Total Members</h3>
            <p className='text-2xl font-bold text-blue-600'>{data?.length || 0}</p>
          </div>
          <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Active Members</h3>
            <p className='text-2xl font-bold text-green-600'>
              {data?.filter(user => user.isActive).length || 0}
            </p>
          </div>
          <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Total Tasks</h3>
            <p className='text-2xl font-bold text-purple-600'>{tasksData?.tasks?.length || 0}</p>
          </div>
          <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Assigned Tasks</h3>
            <p className='text-2xl font-bold text-orange-600'>
              {tasksData?.tasks?.filter(task => task.team && task.team.length > 0).length || 0}
            </p>
          </div>
        </div>
        <div className='bg-white dark:bg-[#1f1f1f] px-2 md:px-4 py-4 shadow rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {data?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;

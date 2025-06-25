import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { Button, Loading, Table, Tabs, Title } from "../components";
import { AddTask, BoardView, TaskTitle } from "../components/tasks";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { TASK_TYPE } from "../utils";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const params = useParams();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  // Determine status: either from URL param or based on route
  let status = params?.status;
  if (!status) {
    if (location.pathname.startsWith('/completed')) status = 'completed';
    else if (location.pathname.startsWith('/in-progress')) status = 'in progress';
    else if (location.pathname.startsWith('/todo')) status = 'todo';
    else status = '';
  }

  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: searchTerm,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        <Button
          label='Create Idea'
          icon={<IoMdAdd className='text-lg' />}
          className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          onClick={() => setOpen(true)}
        />
      </div>

      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          <div className='w-full flex justify-center gap-4 md:gap-x-12 py-4'>
            {(!status || status === "todo") && (
              <TaskTitle label='New' className={TASK_TYPE.todo} />
            )}
            {(!status || status === "in progress") && (
              <TaskTitle
                label='In Progress'
                className={TASK_TYPE["in progress"]}
              />
            )}
            {(!status || status === "completed") && (
              <TaskTitle label='Done' className={TASK_TYPE.completed} />
            )}
          </div>

          {selected === 0 ? (
            <BoardView tasks={data?.tasks} status={status} />
          ) : (
            <Table tasks={data?.tasks} />
          )}
        </Tabs>
      </div>
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;

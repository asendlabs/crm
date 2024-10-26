"use client";
import { NewTaskForm } from "@/app/app/_components/forms/NewTaskForm";
import { Button } from "@/components/ui/button";
import { AccountContext } from "@/providers/accountProvider";
import { Plus } from "lucide-react";
import { useContext, useState } from "react";
import { TaskCard } from "./TaskCard";
export function TaskPanel() {
  const { tasks } = useContext(AccountContext);
  const [taskFormOpen, setTaskFormOpen] = useState(false);

  return (
    <section className="grid w-full gap-3 pt-1">
      <section className="absolute right-[1rem] top-[4.12rem]">
        <div className="flex gap-2">
          <Button
            className="inline-flex !h-fit !max-h-fit gap-1.5 px-1.5 py-1"
            variant="outline"
            onClick={() => {
              setTaskFormOpen((prevState) => !prevState);
            }}
          >
            <Plus size={14} />
            New Task
          </Button>
        </div>
      </section>

      {/* Render the form only when it is open */}
      {taskFormOpen && <NewTaskForm setTaskFormOpen={setTaskFormOpen} />}

      <div
        className={`grid ${taskFormOpen ? "max-h-[70vh]" : "max-h-[81vh]"} min-w-full gap-2 overflow-hidden overflow-y-auto`}
      >
        {tasks && tasks.length > 0
          ? tasks
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((task) => <TaskCard task={task} key={task.id} />)
          : null}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@database/types";
import {
  CalendarIcon,
  Flag,
  Loader2,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerAction } from "zsa-react";
import { deleteTaskAction, updateTaskAction } from "@/server/tasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

export default function TaskCard({ task }: { task: Task }) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate) : null,
  );
  const [isOverdue, setIsOverdue] = useState(false);
  const [renameMode, setRenameMode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [taskStage, setTaskStage] = useState(task.stage); // Local task stage state

  const router = useRouter();
  const { execute: updateTask } = useServerAction(updateTaskAction);
  const { execute: deleteTask } = useServerAction(deleteTaskAction);

  // Update local state when task prop changes
  useEffect(() => {
    setTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setTaskStage(task.stage); // Update the local stage state when task prop changes
  }, [task]);

  // Check if the task is overdue
  useEffect(() => {
    setIsOverdue(dueDate ? dueDate < new Date() : false);
  }, [dueDate]);

  const handleUpdateTask = async (newValue: string, columnId: string) => {
    setUpdating(true);
    try {
      // Optimistically update the local state
      if (columnId === "stage")
        setTaskStage(newValue as "todo" | "in_progress" | "done"); // Update local task stage state
      if (columnId === "title") setTitle(newValue);
      if (columnId === "priority")
        setPriority(newValue as "low" | "medium" | "high" | null);

      const [data, err] = await updateTask({
        itemId: task.id,
        columnId,
        newValue,
      });
      if (!err) {
        router.refresh();
      } else {
        toast.error("Failed to update task.");
        if (columnId === "stage") setTaskStage(task.stage); // Revert on failure
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    setDeleting(true);
    try {
      const [data, err] = await deleteTask({
        itemIds: [task.id],
      });
      if (!err) {
        router.refresh();
      } else {
        toast.error("Failed to delete task.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCheckboxClick = async () => {
    const newStage = taskStage === "done" ? "todo" : "done";
    setTaskStage(newStage); // Optimistically update local stage
    await handleUpdateTask(newStage, "stage"); // Update task stage in the server
  };

  return (
    <div className="w-full space-y-1.5 rounded-lg border p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center space-x-2.5 ${taskStage === "done" ? "opacity-50" : ""}`}
        >
          <Checkbox
            id="task"
            checked={taskStage === "done"}
            onClick={handleCheckboxClick} // Call the checkbox handler
          />
          {renameMode ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={title}
                className="h-8 px-1.5 text-base"
                onChange={(e) => setTitle(e.target.value)}
                onBlur={async () => {
                  setRenameMode(false);
                  await handleUpdateTask(title, "title");
                }}
              />
              {updating && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
            </div>
          ) : (
            <label
              htmlFor="task"
              className={`text-sm font-medium ${taskStage === "done" ? "text-gray-400 line-through" : "text-gray-900"}`}
            >
              {title}
            </label>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <Select
              open={false} // Due date selector functionality can be added here
              onOpenChange={() => {}}
            >
              <SelectTrigger
                className={`inline-flex h-7 w-fit cursor-pointer select-none items-center gap-[0.25rem] rounded-md px-2 py-0.5 text-sm font-medium capitalize ${isOverdue ? "text-red-900" : "text-gray-900"}`}
              >
                <CalendarIcon className="h-2.5 w-2.5" />
                {dueDate ? dueDate.toLocaleDateString() : "No due date"}
              </SelectTrigger>
            </Select>

            <Select
              value={priority || undefined}
              onValueChange={(value) => handleUpdateTask(value, "priority")}
            >
              <SelectTrigger
                className={`inline-flex h-7 w-fit cursor-pointer select-none items-center gap-[0.25rem] rounded-md px-2 py-0.5 text-sm font-medium capitalize ${priority === "high" ? "text-red-900" : priority === "medium" ? "text-orange-900" : "text-blue-900"}`}
              >
                <Flag className="h-2.5 w-2.5" />
                {priority}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="mr-0.5 h-7 w-7" variant="outline">
                <MoreVertical className="h-4 w-4 p-[0.05rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-[1.9rem] w-20">
              <DropdownMenuItem onClick={() => setRenameMode(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteTask}>
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="mr-2 h-4 w-4" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

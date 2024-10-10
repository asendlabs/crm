import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@database/types";
import {
  CalendarIcon,
  Flag,
  Loader,
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
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { format } from "date-fns"; // Import date formatting library
import { useServerAction } from "zsa-react";
import { deleteTaskAction, updateTaskAction } from "@/server/tasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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

  const handleUpdateTask = async (
    newValue: string | Date | null,
    columnId: string,
  ) => {
    setUpdating(true);
    try {
      // Optimistically update the local state
      if (columnId === "stage")
        setTaskStage(newValue as "todo" | "in_progress" | "done");
      if (columnId === "title") setTitle(newValue as string);
      if (columnId === "priority")
        setPriority(newValue as "low" | "medium" | "high" | null);
      if (columnId === "dueDate") setDueDate(newValue as Date | null);

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
    <div className="w-full space-y-1.5 rounded-lg border px-3 py-1.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center space-x-2.5 ${taskStage === "done" ? "" : ""}`}
        >
          <Checkbox
            id="task"
            checked={taskStage === "done"}
            onClick={handleCheckboxClick} // Call the checkbox handler
          />
          {renameMode ? (
            <div className="flex select-text items-center gap-1">
              <Input
                type="text"
                value={title}
                className="h-8 w-96 px-1.5"
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setRenameMode(false);
                    handleUpdateTask(title, "title");
                  }
                }}
                onBlur={async () => {
                  setRenameMode(false);
                  await handleUpdateTask(title, "title");
                }}
              />
              {updating && (
                <Loader className="ml-2 h-5 w-5 animate-spin select-text" />
              )}
            </div>
          ) : (
            <label
              onClick={() => {}}
              onDoubleClick={() => {}}
              className={`text-sm font-medium ${taskStage === "done" ? "line-through" : "text-gray-800"}`}
            >
              {title}
            </label>
          )}
        </div>
        <div className="flex items-center space-x-0">
          {/* Due Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="link"
                className={`w-54 flex h-7 items-center justify-end border-none text-right text-sm font-medium ${
                  isOverdue
                    ? "text-red-800 hover:!text-red-800"
                    : dueDate
                      ? "text-green-800 hover:!text-green-800"
                      : ""
                } ${taskStage === "done" ? "line-through" : ""}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "No due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={dueDate ? dueDate : undefined}
                onSelect={(date) => handleUpdateTask(date || null, "dueDate")}
              />
            </PopoverContent>
          </Popover>

          {/* Priority Dropdown */}
          <Select
            value={priority || undefined}
            onValueChange={(value) => handleUpdateTask(value, "priority")}
          >
            <SelectTrigger
              className={`inline-flex h-7 w-fit cursor-pointer select-none items-center gap-[0.25rem] !rounded-none !border-none !bg-none px-0 py-0.5 pr-3 text-sm font-medium capitalize !shadow-none !outline-none !ring-0 ${
                priority === "high"
                  ? "!text-red-800"
                  : priority === "medium"
                    ? "!text-yellow-800"
                    : priority === "low"
                      ? "!text-blue-800"
                      : ""
              } ${taskStage === "done" ? "line-through" : ""}`}
            >
              <Flag className="h-2.5 w-2.5" />
              {priority || "Choose Priority"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="low"
                showIndicator={false}
                className="font-medium !text-blue-800 hover:!text-blue-800"
              >
                Low
              </SelectItem>
              <SelectItem
                value="medium"
                showIndicator={false}
                className="font-medium !text-yellow-800 hover:!text-yellow-800"
              >
                Medium
              </SelectItem>
              <SelectItem
                value="high"
                showIndicator={false}
                className="font-medium !text-red-800 hover:!text-red-800"
              >
                High
              </SelectItem>
            </SelectContent>
          </Select>

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
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
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

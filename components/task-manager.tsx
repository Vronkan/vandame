'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar"
import { Button } from "@/components/ui/button"

interface Task {
  title: string;
  description: string;
  isNew?: boolean;
  key: number;
  time?: string;
}

interface Column {
  title: "To do" | "In progress" | "Done";
  color: string;
  buttonBg: string;
  textColor: string;
  titleColor?: string;
  descriptionColor?: string;
  bodyTextColor?: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  { 
    title: "To do", 
    color: '#F7F7F7', 
    buttonBg: '#E7E7E7', 
    textColor: '#202020',
    titleColor: '#202020',
    descriptionColor: '#404040',
    tasks: []
  },
  { 
    title: "In progress", 
    color: '#F3F5FF', 
    buttonBg: '#E3E5FF', 
    textColor: '#3B2B6B', 
    tasks: []
  },
  { 
    title: "Done", 
    color: '#EDF9ED', 
    buttonBg: '#D5EFD5', 
    textColor: '#0A3D0A', 
    bodyTextColor: '#0A2E0A', 
    tasks: []
  }
]

const ItemTypes = {
  TASK: 'task',
};

interface TaskCardProps {
  task: Task;
  columnIndex: number;
  taskIndex: number;
  updateTask: (columnIndex: number, taskIndex: number, field: 'title' | 'description', value: string) => void;
  saveTask: (columnIndex: number, taskIndex: number) => void;
  startEditing: (columnIndex: number, taskIndex: number, field: 'title' | 'description') => void;
  handleBlur: () => void;
  adjustTextareaHeight: (textarea: HTMLTextAreaElement) => void;
  adjustInputHeight: (input: HTMLInputElement) => void;
  titleInputRef: React.RefObject<HTMLTextAreaElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  editingTask: { columnIndex: number; taskIndex: number; field: 'title' | 'description' | null };
  textColor: string;
  bodyTextColor?: string;
  buttonBg: string;
  moveTask: (dragIndex: number, hoverIndex: number, sourceColumnIndex: number, targetColumnIndex: number) => void;
}

function TaskCard({ task, columnIndex, taskIndex, updateTask, saveTask, startEditing, handleBlur, adjustTextareaHeight, adjustInputHeight, titleInputRef, textareaRef, editingTask, textColor, bodyTextColor, buttonBg, moveTask }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { type: ItemTypes.TASK, id: task.key, index: taskIndex, columnIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item: { type: string, id: number; index: number; columnIndex: number }, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = taskIndex
      const sourceColumnIndex = item.columnIndex
      const targetColumnIndex = columnIndex

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceColumnIndex === targetColumnIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveTask(dragIndex, hoverIndex, sourceColumnIndex, targetColumnIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
      item.columnIndex = targetColumnIndex
    },
  })

  drag(drop(ref))

  // Provide a default value for editingTask
  const isEditing = editingTask && editingTask.columnIndex === columnIndex && editingTask.taskIndex === taskIndex;

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl p-3 mb-3 flex flex-col relative cursor-move overflow-hidden"
      style={{ 
        minHeight: '120px',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex-grow flex flex-col">
        <div className="mb-2 w-full">
          {task.isNew || (isEditing && editingTask.field === 'title') ? (
            <textarea
              ref={titleInputRef as React.RefObject<HTMLTextAreaElement>}
              value={task.title}
              onChange={(e) => {
                updateTask(columnIndex, taskIndex, 'title', e.target.value);
                adjustTextareaHeight(e.target);
              }}
              onBlur={() => handleBlur()}
              placeholder="Task title"
              className="text-lg font-medium w-full outline-none break-words bg-transparent resize-none overflow-hidden"
              style={{ 
                color: textColor, 
                overflowWrap: 'break-word', 
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                hyphens: 'auto',
                whiteSpace: 'pre-wrap'
              }}
            />
          ) : (
            <h2 
              className="text-lg font-medium break-words w-full pr-4"
              style={{ 
                color: textColor, 
                overflowWrap: 'break-word', 
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                hyphens: 'auto',
                whiteSpace: 'pre-wrap'
              }}
              onClick={() => startEditing(columnIndex, taskIndex, 'title')}
            >
              {task.title || "Untitled"}
            </h2>
          )}
        </div>
        <div className="flex-grow">
          {task.isNew || (isEditing && editingTask.field === 'description') ? (
            <textarea
              ref={textareaRef}
              value={task.description}
              onChange={(e) => {
                updateTask(columnIndex, taskIndex, 'description', e.target.value);
                adjustTextareaHeight(e.target);
              }}
              onBlur={() => handleBlur()}
              placeholder="Task description"
              className="text-sm w-full outline-none resize-none break-words bg-transparent h-full"
              style={{ color: bodyTextColor || textColor, overflowWrap: 'break-word', wordWrap: 'break-word' }}
            />
          ) : (
            <p className="text-sm break-words h-full" style={{ color: bodyTextColor || textColor, overflowWrap: 'break-word', wordWrap: 'break-word' }} onClick={() => startEditing(columnIndex, taskIndex, 'description')}>
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="w-full flex justify-end" style={{ padding: '0.75rem' }}> {/* Increased padding */}
        {(task.isNew || isEditing) && (
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-opacity-80 px-3 py-1 text-xs font-normal"
            style={{ 
              backgroundColor: buttonBg, 
              color: textColor,
              transform: 'scale(1.15)',
              transformOrigin: 'center',
              marginRight: '-0.25rem', // Adjust to align with card edge
              marginBottom: '-0.25rem' // Adjust to align with card edge
            }}
            onClick={() => saveTask(columnIndex, taskIndex)}
          >
            Save
          </Badge>
        )}
      </div>
    </div>
  );
}

interface ColumnComponentProps {
  column: Column;
  columnIndex: number;
  addNewTask: (columnIndex: number) => void;
  moveTask: (dragIndex: number, hoverIndex: number, sourceColumnIndex: number, targetColumnIndex: number) => void;
  updateTask: (columnIndex: number, taskIndex: number, field: 'title' | 'description', value: string) => void;
  saveTask: (columnIndex: number, taskIndex: number) => void;
  startEditing: (columnIndex: number, taskIndex: number, field: 'title' | 'description') => void;
  handleBlur: () => void;
  adjustTextareaHeight: (textarea: HTMLTextAreaElement) => void;
  adjustInputHeight: (input: HTMLInputElement) => void;
  titleInputRef: React.RefObject<HTMLTextAreaElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  editingTask: { columnIndex: number; taskIndex: number; field: 'title' | 'description' | null };
}

function ColumnComponent({ column, columnIndex, addNewTask, moveTask, updateTask, saveTask, startEditing, handleBlur, adjustTextareaHeight, adjustInputHeight, titleInputRef, textareaRef, editingTask }: ColumnComponentProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item: { type: string, id: number; index: number; columnIndex: number }, monitor) {
      if (!ref.current) {
        return
      }
      const draggedColumnIndex = item.columnIndex
      const targetColumnIndex = columnIndex

      // Don't do anything if hovering over the same column
      if (draggedColumnIndex === targetColumnIndex) {
        return
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const clientOffset = monitor.getClientOffset()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Get pixels to the top
      const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top

      let newIndex
      if (hoverClientY < hoverMiddleY) {
        // If in upper half, move to the beginning of the column
        newIndex = 0
      } else {
        // If in lower half, move to the end of the column
        newIndex = column.tasks.length
      }

      // Move the task
      moveTask(item.index, newIndex, draggedColumnIndex, targetColumnIndex)

      // Update the item's position
      item.index = newIndex
      item.columnIndex = targetColumnIndex
    },
  })

  drop(ref)

  const renderIcon = () => {
    const iconPaths = {
      "To do": "M196,88a27.86,27.86,0,0,0-13.35,3.39A28,28,0,0,0,144,74.7V44a28,28,0,0,0-56,0v80l-3.82-6.13A28,28,0,0,0,35.73,146l4.67,8.23C74.81,214.89,89.05,240,136,240a88.1,88.1,0,0,0,88-88V116A28,28,0,0,0,196,88Zm12,64a72.08,72.08,0,0,1-72,72c-37.63,0-47.84-18-81.68-77.68l-4.69-8.27,0-.05A12,12,0,0,1,54,121.61a11.88,11.88,0,0,1,6-1.6,12,12,0,0,1,10.41,6,1.76,1.76,0,0,0,.14.23l18.67,30A8,8,0,0,0,104,152V44a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0V100a12,12,0,0,1,24,0Z",
      "In progress": "M200,75.64V40a16,16,0,0,0-16-16H72A16,16,0,0,0,56,40V76a16.07,16.07,0,0,0,6.4,12.8L114.67,128,62.4,167.2A16.07,16.07,0,0,0,56,180v36a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V180.36a16.08,16.08,0,0,0-6.35-12.76L141.27,128l52.38-39.6A16.05,16.05,0,0,0,200,75.64ZM178.23,176H77.33L128,138ZM72,216V192H184v24ZM184,75.64,128,118,72,76V40H184Z",
      "Done": "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.77,3.77-7.67,8-9.14,11.57-1.36,3.27-1.44,8.69-1.52,13.94-.15,9.76-.31,20.82-8,28.51s-18.75,7.85-28.51,8c-5.25.08-10.67.16-13.94,1.52-3.56,1.47-7.63,5.37-11.57,9.14C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.77,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.15,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.15,214.31,142.11ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z",
    };

    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill={column.textColor}>
        <path d={iconPaths[column.title]} />
      </svg>
    );
  };

  return (
    <div 
      ref={ref} 
      className="flex-1 rounded-2xl overflow-hidden"
      style={{ 
        backgroundColor: column.color, 
        position: 'relative', 
        minHeight: 'auto',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '20px'
      }}
    >
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            {renderIcon()}
            <h2 className="text-base font-bold ml-2" style={{ color: column.textColor }}>{column.title}</h2>
          </div>
          <Button 
            variant="ghost" 
            className="hover:bg-opacity-80 rounded-full px-4 py-2 flex items-center"
            style={{ backgroundColor: column.buttonBg, color: column.textColor }}
            onClick={() => addNewTask(columnIndex)}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-white">
              <Plus className="h-4 w-4" style={{ color: column.textColor }} />
            </div>
            New Task
          </Button>
        </div>
        
        <div>
          {column.tasks.map((task, taskIndex) => (
            task && (
              <TaskCard
                key={task.key || taskIndex}
                task={task}
                columnIndex={columnIndex}
                taskIndex={taskIndex}
                moveTask={moveTask}
                updateTask={updateTask}
                saveTask={saveTask}
                startEditing={startEditing}
                handleBlur={handleBlur}
                adjustTextareaHeight={adjustTextareaHeight}
                adjustInputHeight={adjustInputHeight}
                titleInputRef={titleInputRef}
                textareaRef={textareaRef}
                editingTask={editingTask}
                textColor={column.textColor}
                bodyTextColor={column.bodyTextColor}
                buttonBg={column.buttonBg}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export function TaskManagerComponent() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [editingTask, setEditingTask] = useState<{ columnIndex: number; taskIndex: number; field: 'title' | 'description' | null }>({ columnIndex: -1, taskIndex: -1, field: null });
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newTaskKey, setNewTaskKey] = useState<number | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const addNewTask = (columnIndex: number) => {
    const newKey = Date.now();
    const newColumns = [...columns];
    newColumns[columnIndex].tasks.unshift({
      title: '',
      description: '',
      isNew: true,
      key: newKey,
      time: ''
    });
    setColumns(newColumns);
    setEditingTask({ columnIndex, taskIndex: 0, field: 'title' });
    setNewTaskKey(newKey);
  }

  const updateTask = (columnIndex: number, taskIndex: number, field: 'title' | 'description', value: string) => {
    const newColumns = [...columns]
    newColumns[columnIndex].tasks[taskIndex][field] = value
    setColumns(newColumns)
  }

  const saveTask = (columnIndex: number, taskIndex: number) => {
    const newColumns = [...columns];
    const task = newColumns[columnIndex].tasks[taskIndex];
    if ('isNew' in task) {
      delete task.isNew;
    }
    setColumns(newColumns);
    setEditingTask({ columnIndex: -1, taskIndex: -1, field: null });
    setNewTaskKey(null);  // Add this line
  }

  const startEditing = (columnIndex: number, taskIndex: number, field: 'title' | 'description') => {
    setEditingTask({ columnIndex, taskIndex, field })
  }

  const handleBlur = () => {
    setEditingTask({ columnIndex: -1, taskIndex: -1, field: null })
  }

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  const adjustInputHeight = (input: HTMLInputElement) => {
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
  };

  useEffect(() => {
    if (editingTask.field === 'title' && titleInputRef.current) {
      titleInputRef.current.focus();
      adjustInputHeight(titleInputRef.current);
    } else if (editingTask.field === 'description' && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight(textareaRef.current);
    }
  }, [editingTask]);

  const moveTask = useCallback((dragIndex: number, hoverIndex: number, sourceColumnIndex: number, targetColumnIndex: number) => {
    setColumns((prevColumns) => {
      const newColumns = JSON.parse(JSON.stringify(prevColumns))
      const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(dragIndex, 1)
      
      const targetColumnLength = newColumns[targetColumnIndex].tasks.length
      const adjustedHoverIndex = Math.min(Math.max(hoverIndex, 0), targetColumnLength)
      
      newColumns[targetColumnIndex].tasks.splice(adjustedHoverIndex, 0, movedTask)

      // Update completion percentage
      const completedTasks = newColumns[2].tasks.length; // Assuming the "Done" column is at index 2
      const newPercentage = Math.min(completedTasks, 100); // Each task is 1%, max 100%
      setCompletionPercentage(newPercentage);

      return newColumns
    })
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="py-8">
        <div className="w-full mb-6 bg-[#F7F7F7] rounded-2xl h-24 flex items-center justify-between px-6">
          <input
            type="text"
            placeholder="Board Title"
            className="text-3xl font-bold text-black bg-transparent outline-none placeholder-black"
          />
          <AnimatedCircularProgressBar
            max={100}
            min={0}
            value={Math.round(completionPercentage)}
            gaugePrimaryColor="rgb(244 63 94)" // Changed to red/pink color
            gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
            className="size-16"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          {columns.map((column, columnIndex) => (
            <ColumnComponent
              key={columnIndex}
              column={column}
              columnIndex={columnIndex}
              addNewTask={addNewTask}
              moveTask={moveTask}
              updateTask={updateTask}
              saveTask={saveTask}
              startEditing={startEditing}
              handleBlur={handleBlur}
              adjustTextareaHeight={adjustTextareaHeight}
              adjustInputHeight={adjustInputHeight}
              titleInputRef={titleInputRef}
              textareaRef={textareaRef}
              editingTask={editingTask}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  )
}
'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Bricolage_Grotesque } from 'next/font/google'
import { useState, useRef, useEffect } from 'react'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'] })

const initialColumns = [
  { 
    title: "To do", 
    color: '#F7F7F7', 
    buttonBg: '#E7E7E7', 
    textColor: '#606060', 
    icon: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={color} viewBox="0 0 256 256">
        <path d="M196,88a27.86,27.86,0,0,0-13.35,3.39A28,28,0,0,0,144,74.7V44a28,28,0,0,0-56,0v80l-3.82-6.13A28,28,0,0,0,35.73,146l4.67,8.23C74.81,214.89,89.05,240,136,240a88.1,88.1,0,0,0,88-88V116A28,28,0,0,0,196,88Zm12,64a72.08,72.08,0,0,1-72,72c-37.63,0-47.84-18-81.68-77.68l-4.69-8.27,0-.05A12,12,0,0,1,54,121.61a11.88,11.88,0,0,1,6-1.6,12,12,0,0,1,10.41,6,1.76,1.76,0,0,0,.14.23l18.67,30A8,8,0,0,0,104,152V44a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0V100a12,12,0,0,1,24,0Z"></path>
      </svg>
    ),
    tasks: [
      { title: "Design new landing page", description: "Create a modern and engaging landing page for our product launch. This should include responsive design, optimized images, and clear call-to-action buttons. Coordinate with the marketing team to ensure brand consistency and messaging alignment.", time: "8h" },
      { description: "Review and update the user guide for the latest software release. Focus on new features and any changes to existing functionality.", time: "3h" },
      { title: "Bug fix: login issue", description: "Investigate and resolve the intermittent login problem reported by users.", time: "1h" },
      { title: "Prepare Q3 report", description: "Compile and analyze data for the quarterly report. Include key performance indicators, revenue trends, and project milestones.", time: "4h" },
      { description: "Team meeting to discuss project priorities and resource allocation for the upcoming sprint.", time: "1h" },
    ]
  },
  { 
    title: "In progress", 
    color: '#F3F5FF', 
    buttonBg: '#E3E5FF', 
    textColor: '#3B2B6B', 
    icon: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={color} viewBox="0 0 256 256">
        <path d="M200,75.64V40a16,16,0,0,0-16-16H72A16,16,0,0,0,56,40V76a16.07,16.07,0,0,0,6.4,12.8L114.67,128,62.4,167.2A16.07,16.07,0,0,0,56,180v36a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V180.36a16.08,16.08,0,0,0-6.35-12.76L141.27,128l52.38-39.6A16.05,16.05,0,0,0,200,75.64ZM178.23,176H77.33L128,138ZM72,216V192H184v24ZM184,75.64,128,118,72,76V40H184Z"></path>
      </svg>
    ),
    tasks: [
      { title: "Implement new feature", description: "Develop the new user profile customization feature as per the specifications. This includes adding new fields, implementing data validation, and ensuring proper database integration.", time: "6h" },
      { description: "Ongoing code review for the payment gateway integration. Ensure security best practices are followed and performance optimizations are in place.", time: "2h" },
      { title: "User testing", description: "Conduct user testing sessions for the beta version of the mobile app. Gather feedback and identify any usability issues or bugs.", time: "4h" },
    ]
  },
  { 
    title: "Done", 
    color: '#EDF9ED', 
    buttonBg: '#D5EFD5', 
    textColor: '#0A3D0A', 
    bodyTextColor: '#0A2E0A', 
    icon: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={color} viewBox="0 0 256 256">
        <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.77,3.94-7.67,8-9.14,11.57C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.15,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.15,214.31,142.11ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"></path>
      </svg>
    ),
    tasks: [
      { title: "Database optimization", description: "Optimized database queries for improved performance. Implemented indexing and query caching to reduce response times by 30%.", time: "5h" },
      { description: "Completed the redesign of the user dashboard with new widgets and improved data visualization.", time: "8h" },
      { title: "API documentation", description: "Updated API documentation for v2.0 release. Included new endpoints, request/response examples, and authentication details.", time: "3h" },
      { title: "Security audit", description: "Conducted a comprehensive security audit of the application. Identified and addressed potential vulnerabilities in user authentication and data encryption.", time: "6h" },
    ]
  }
]

export function TaskManagerComponent() {
  const [columns, setColumns] = useState(initialColumns)
  const [editingTask, setEditingTask] = useState<{ columnIndex: number, taskIndex: number } | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const addNewTask = (columnIndex: number) => {
    const newColumns = [...columns]
    newColumns[columnIndex].tasks.unshift({
      title: '',
      description: '',
      time: '0h'
    })
    setColumns(newColumns)
    setEditingTask({ columnIndex, taskIndex: 0 })
  }

  const updateTask = (columnIndex: number, taskIndex: number, field: 'title' | 'description', value: string) => {
    const newColumns = [...columns]
    newColumns[columnIndex].tasks[taskIndex][field] = value
    setColumns(newColumns)
  }

  const saveTask = (columnIndex: number, taskIndex: number) => {
    setEditingTask(null)
    // Här kan du lägga till ytterligare logik för att spara uppgiften om det behövs
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    if (editingTask && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [editingTask])

  return (
    <div className={`py-8 ${bricolage.className}`}>
      <div className="w-full mb-6 bg-[#F0F0F0] rounded-lg h-24 flex items-center">
        <input
          type="text"
          placeholder="Board Title"
          className="w-full px-6 text-3xl font-bold text-black bg-transparent outline-none placeholder-black"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        {columns.map(({ title, color, buttonBg, textColor, bodyTextColor, icon, tasks }, columnIndex) => (
          <div key={columnIndex} className="flex-1 rounded-lg overflow-hidden" style={{ backgroundColor: color }}>
            <div className="p-3">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  {icon(textColor)}
                  <h2 className="text-base font-bold ml-2" style={{ color: textColor }}>{title}</h2>
                </div>
                <Button 
                  variant="ghost" 
                  className="hover:bg-opacity-80 rounded-full px-4 py-2 flex items-center"
                  style={{ backgroundColor: buttonBg, color: textColor }}
                  onClick={() => addNewTask(columnIndex)}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-white">
                    <Plus className="h-4 w-4" style={{ color: textColor }} />
                  </div>
                  New Task
                </Button>
              </div>
              
              {/* Task Cards */}
              {tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="bg-white rounded-xl p-3 mb-3">
                  {editingTask?.columnIndex === columnIndex && editingTask?.taskIndex === taskIndex ? (
                    <>
                      <input
                        ref={titleInputRef}
                        type="text"
                        value={task.title}
                        onChange={(e) => updateTask(columnIndex, taskIndex, 'title', e.target.value)}
                        className="text-xl font-bold mb-2 w-full outline-none break-words"
                        style={{ color: textColor, overflowWrap: 'break-word', wordWrap: 'break-word' }}
                        placeholder="Task Title"
                      />
                      <textarea
                        ref={textareaRef}
                        value={task.description}
                        onChange={(e) => {
                          updateTask(columnIndex, taskIndex, 'description', e.target.value)
                          adjustTextareaHeight()
                        }}
                        onInput={adjustTextareaHeight}
                        className="mb-3 text-sm w-full outline-none resize-none overflow-hidden break-words"
                        style={{ color: bodyTextColor || textColor, overflowWrap: 'break-word', wordWrap: 'break-word' }}
                        placeholder="Task Description"
                        rows={1}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <button
                          onClick={() => saveTask(columnIndex, taskIndex)}
                          className="inline-block px-2 py-1 text-sm rounded"
                          style={{ backgroundColor: buttonBg, color: textColor }}
                        >
                          Save task
                        </button>
                        <span className="inline-block px-2 py-1 text-sm rounded" style={{ backgroundColor: color, color: textColor }}>
                          {task.time}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {task.title && (
                        <h2 className="text-xl font-bold mb-2 break-words" style={{ color: textColor, overflowWrap: 'break-word', wordWrap: 'break-word' }}>{task.title}</h2>
                      )}
                      <p className="mb-3 text-sm break-words" style={{ color: bodyTextColor || textColor, overflowWrap: 'break-word', wordWrap: 'break-word' }}>
                        {task.description}
                      </p>
                      <div className="flex justify-end mt-2">
                        <span className="inline-block px-2 py-1 text-sm rounded" style={{ backgroundColor: color, color: textColor }}>
                          {task.time}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
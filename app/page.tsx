import { TaskManagerComponent } from "@/components/task-manager";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <TaskManagerComponent />
      </div>
    </div>
  );
}

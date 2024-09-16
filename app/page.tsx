import { TaskManagerComponent } from "@/components/task-manager";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex justify-center relative overflow-hidden">
      <DotPattern
        width={25}
        height={25}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "absolute inset-0 z-0",
          "[mask-image:linear-gradient(to_bottom_right,transparent_-10%,white_40%,transparent_80%)]"
        )}
      />
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <TaskManagerComponent />
      </div>
    </div>
  );
}

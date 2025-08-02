import { DoctorChat } from "@/components/doctor-chat"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DoctorChatPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col p-4 md:p-6 space-y-8">
        <DashboardHeader
          title="Ask Dr. MediBot"
          description="Get health information and advice from our AI medical assistant"
        />
        
        <div className="flex items-center justify-center w-full pt-4">
          <DoctorChat />
        </div>
      </div>
    </DashboardLayout>
  )
} 
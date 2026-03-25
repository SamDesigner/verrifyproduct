"use client"
import { DashboardActivityFeed } from "@/app/components/dashboard"
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const total = requests.length;
    const initiated = requests.filter((r) => r.stage === "INITIATED").length;
    const accepted = requests.filter((r) => r.stage === "VERIFICATION_ACCEPTED").length;
    const pendingPayment = requests.filter((r) => r.stage === "PENDING_PAYMENT").length;
    const activityFeed = requests
        .flatMap((r) => (r.stageHistory ?? []).map((h) => ({
            stage: h.stage,
            propertyName: r.property.name,
            completedAt: h.completedAt,
        })))
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 8);


    return (
        <div className="min-h-screen p-6 bg-gray-900 rounded-xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Notifications</h1>
            </div>
            <div>
                <DashboardActivityFeed feed={activityFeed} loading={loading} />
            </div>
        </div>
    )
}

export default Page
import { CalendarDays } from "lucide-react";
import { InterviewCard, PageShell, interviewSchedule } from "@/components/hirelens";

export default function RecruiterInterviewsPage() {
  return (
    <PageShell
      role="recruiter"
      title="Interview pipeline"
      subtitle="Coordinate interviews, assess progress, and keep decision-making organized."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"><CalendarDays className="h-4 w-4" /> Book session</button>}
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {interviewSchedule.map((item) => (
          <InterviewCard key={item.candidate} {...item} />
        ))}
      </div>
    </PageShell>
  );
}

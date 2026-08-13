import { CalendarClock } from "lucide-react";
import { InterviewCard, PageShell, interviewSchedule } from "@/components/hirelens";

export default function InterviewsPage() {
  return (
    <PageShell
      role="candidate"
      title="Interviews"
      subtitle="Your upcoming conversations and preparation notes are all in one place."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"><CalendarClock className="h-4 w-4" /> Schedule</button>}
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {interviewSchedule.map((item) => (
          <InterviewCard key={item.candidate} {...item} />
        ))}
      </div>
    </PageShell>
  );
}

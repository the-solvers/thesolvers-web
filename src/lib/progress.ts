export type ProgressMilestone = {
  done?: boolean | null;
};

const clampProgress = (value: number) => Math.min(100, Math.max(0, value));

export const getMilestoneProgress = (
  milestones: ProgressMilestone[],
  fallbackProgress = 0
) => {
  if (milestones.length === 0) return clampProgress(fallbackProgress);

  const completed = milestones.filter(m => m.done).length;
  return clampProgress(Math.round((completed / milestones.length) * 100));
};

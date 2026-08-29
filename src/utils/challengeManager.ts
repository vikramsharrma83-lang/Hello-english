import { FiveDayChallenge, UserProgress } from '../types';

export function getOrCreateChallenge(progress: UserProgress): FiveDayChallenge {
  if (progress.challenge) {
    // Update live counts
    const myDayCount = progress.myDayCompletedTasks?.length || 2;
    const questionsCount = progress.totalPracticed || 18;
    const totalActivities = myDayCount + questionsCount;

    return {
      ...progress.challenge,
      myDayCompletedCount: myDayCount,
      coachQuestionsCompletedCount: questionsCount,
    };
  }

  // Initial 5-day challenge state
  const myDayCount = progress.myDayCompletedTasks?.length || 2;
  const questionsCount = progress.totalPracticed || 18;
  const currentDay = Math.min(5, Math.max(1, (progress.streakDays % 5) || 3));
  const daysRemaining = Math.max(1, 5 - currentDay + 1);

  return {
    startDate: Date.now() - (currentDay - 1) * 86400000,
    totalDays: 5,
    daysRemaining,
    currentDay,
    myDayTarget: 5,
    myDayCompletedCount: myDayCount,
    coachQuestionsTarget: 100,
    coachQuestionsCompletedCount: questionsCount,
    dailyProgress: [
      {
        day: 1,
        dayLabel: 'Day 1',
        isCompleted: true,
        isCurrent: false,
        myDayCompleted: true,
        questionsCompleted: 20,
        questionsTarget: 20,
      },
      {
        day: 2,
        dayLabel: 'Day 2',
        isCompleted: true,
        isCurrent: false,
        myDayCompleted: true,
        questionsCompleted: 20,
        questionsTarget: 20,
      },
      {
        day: 3,
        dayLabel: 'Day 3 (Today)',
        isCompleted: false,
        isCurrent: true,
        myDayCompleted: myDayCount >= 3,
        questionsCompleted: Math.max(0, questionsCount - 40),
        questionsTarget: 20,
      },
      {
        day: 4,
        dayLabel: 'Day 4',
        isCompleted: false,
        isCurrent: false,
        myDayCompleted: false,
        questionsCompleted: 0,
        questionsTarget: 20,
      },
      {
        day: 5,
        dayLabel: 'Day 5',
        isCompleted: false,
        isCurrent: false,
        myDayCompleted: false,
        questionsCompleted: 0,
        questionsTarget: 20,
      },
    ],
  };
}

export function recordChallengePractice(
  progress: UserProgress,
  activityType: 'my_day_activity' | 'coach_question'
): UserProgress {
  const currentChallenge = getOrCreateChallenge(progress);

  const updatedChallenge: FiveDayChallenge = {
    ...currentChallenge,
    myDayCompletedCount:
      activityType === 'my_day_activity'
        ? Math.min(currentChallenge.myDayTarget, currentChallenge.myDayCompletedCount + 1)
        : currentChallenge.myDayCompletedCount,
    coachQuestionsCompletedCount:
      activityType === 'coach_question'
        ? Math.min(currentChallenge.coachQuestionsTarget, currentChallenge.coachQuestionsCompletedCount + 1)
        : currentChallenge.coachQuestionsCompletedCount,
  };

  // Recalculate daily breakdown
  const currentDayIndex = Math.min(4, Math.max(0, updatedChallenge.currentDay - 1));
  const updatedDaily = [...updatedChallenge.dailyProgress];
  if (updatedDaily[currentDayIndex]) {
    const dayItem = { ...updatedDaily[currentDayIndex] };
    if (activityType === 'my_day_activity') {
      dayItem.myDayCompleted = true;
    } else if (activityType === 'coach_question') {
      dayItem.questionsCompleted = Math.min(dayItem.questionsTarget, dayItem.questionsCompleted + 1);
    }
    if (dayItem.myDayCompleted && dayItem.questionsCompleted >= dayItem.questionsTarget) {
      dayItem.isCompleted = true;
    }
    updatedDaily[currentDayIndex] = dayItem;
  }
  updatedChallenge.dailyProgress = updatedDaily;

  return {
    ...progress,
    challenge: updatedChallenge,
  };
}

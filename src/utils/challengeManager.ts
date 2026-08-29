import { FiveDayChallenge, UserProgress } from '../types';

export function getOrCreateChallenge(progress: UserProgress): FiveDayChallenge {
  if (progress.challenge) {
    // Update live counts
    const myDayCount = progress.myDayCompletedTasks?.length || 2;
    const questionsCount = progress.totalPracticed || 18;

    return {
      ...progress.challenge,
      myDayCompletedCount: Math.max(progress.challenge.myDayCompletedCount || 0, myDayCount),
      coachQuestionsCompletedCount: Math.max(progress.challenge.coachQuestionsCompletedCount || 0, questionsCount),
    };
  }

  // Initial 5-day challenge state (defaults to started/ongoing for active learners or startable)
  const myDayCount = progress.myDayCompletedTasks?.length || 2;
  const questionsCount = progress.totalPracticed || 18;
  const currentDay = Math.min(5, Math.max(1, (progress.streakDays % 5) || 3));
  const daysRemaining = Math.max(1, 5 - currentDay + 1);

  return {
    isStarted: true,
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
        isStarted: true,
        myDayCompleted: true,
        questionsCompleted: 20,
        questionsTarget: 20,
        completedActivities: [
          'Morning Routine & Work Greeting Story (My Day)',
          '20 Workplace Speaking Drills (Coach Neha)',
          'Shift Handover Roleplay Dialogue',
        ],
      },
      {
        day: 2,
        dayLabel: 'Day 2',
        isCompleted: true,
        isCurrent: false,
        isStarted: true,
        myDayCompleted: true,
        questionsCompleted: 20,
        questionsTarget: 20,
        completedActivities: [
          'Inventory & Parcel Damage Reporting Story (My Day)',
          '20 Logistics & Warehouse Questions (Coach Neha)',
          'Manager Confirmation Practice Session',
        ],
      },
      {
        day: 3,
        dayLabel: 'Day 3',
        isCompleted: false,
        isCurrent: true,
        isStarted: true,
        myDayCompleted: myDayCount >= 3,
        questionsCompleted: Math.min(20, Math.max(8, questionsCount - 40)),
        questionsTarget: 20,
        completedActivities: [
          'Lunch Break Conversation with Colleagues (My Day)',
          '8 Real-time Conversation Drills Completed',
        ],
      },
      {
        day: 4,
        dayLabel: 'Day 4',
        isCompleted: false,
        isCurrent: false,
        isStarted: false,
        myDayCompleted: false,
        questionsCompleted: 0,
        questionsTarget: 20,
        completedActivities: [],
      },
      {
        day: 5,
        dayLabel: 'Day 5',
        isCompleted: false,
        isCurrent: false,
        isStarted: false,
        myDayCompleted: false,
        questionsCompleted: 0,
        questionsTarget: 20,
        completedActivities: [],
      },
    ],
  };
}

export function startNewChallenge(progress: UserProgress): UserProgress {
  const newChallenge: FiveDayChallenge = {
    isStarted: true,
    startDate: Date.now(),
    totalDays: 5,
    daysRemaining: 5,
    currentDay: 1,
    myDayTarget: 5,
    myDayCompletedCount: 0,
    coachQuestionsTarget: 100,
    coachQuestionsCompletedCount: 0,
    dailyProgress: [
      {
        day: 1,
        dayLabel: 'Day 1',
        isCompleted: false,
        isCurrent: true,
        isStarted: true,
        myDayCompleted: false,
        questionsCompleted: 0,
        questionsTarget: 20,
        completedActivities: [],
      },
      {
        day: 2,
        dayLabel: 'Day 2',
        isCompleted: false,
        isCurrent: false,
        isStarted: false,
        myDayCompleted: false,
        questionsCompleted: 0,
        questionsTarget: 20,
        completedActivities: [],
      },
      {
        day: 3,
        dayLabel: 'Day 3',
        isCompleted: false,
        isCurrent: false,
        isStarted: false,
        myDayCompleted: false,
        questionsCompleted: 0,
        questionsTarget: 20,
        completedActivities: [],
      },
      {
        day: 4,
        dayLabel: 'Day 4',
        isCompleted: false,
        isCurrent: false,
        isStarted: false,
        myDayCompleted: false,
        questionsCompleted: 0,
        questionsTarget: 20,
        completedActivities: [],
      },
      {
        day: 5,
        dayLabel: 'Day 5',
        isCompleted: false,
        isCurrent: false,
        isStarted: false,
        myDayCompleted: false,
        questionsCompleted: 0,
        questionsTarget: 20,
        completedActivities: [],
      },
    ],
  };

  return {
    ...progress,
    challenge: newChallenge,
  };
}

export function recordChallengePractice(
  progress: UserProgress,
  activityType: 'my_day_activity' | 'coach_question',
  activityTitle?: string
): UserProgress {
  const currentChallenge = getOrCreateChallenge(progress);

  const updatedChallenge: FiveDayChallenge = {
    ...currentChallenge,
    isStarted: true,
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
    const activities = [...(dayItem.completedActivities || [])];

    if (activityType === 'my_day_activity') {
      dayItem.myDayCompleted = true;
      if (activityTitle && !activities.includes(activityTitle)) {
        activities.push(activityTitle);
      } else if (!activities.some((a) => a.includes('My Day'))) {
        activities.push('Daily Speaking Story (My Day)');
      }
    } else if (activityType === 'coach_question') {
      dayItem.questionsCompleted = Math.min(dayItem.questionsTarget, dayItem.questionsCompleted + 1);
      const qText = activityTitle ? `Drill: ${activityTitle}` : `Coach Neha Question #${dayItem.questionsCompleted}`;
      if (!activities.includes(qText)) {
        activities.push(qText);
      }
    }

    dayItem.completedActivities = activities;

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

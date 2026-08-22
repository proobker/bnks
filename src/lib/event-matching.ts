// Transparent, rule-based event matching. No AI scoring - every point comes
// from an auditable criterion so students can see exactly why an event ranks.
import type {
  EventRecord,
  StudentEventProfile,
  EventMatchResult,
  MatchExplanationItem,
  RankedEvent,
  CriterionState,
  ParticipationMode
} from './event-types';

interface CriterionDef {
  field: string;
  weight: number;
  description: string;
}

// Weights sum to 100
export const EVENT_MATCH_CRITERIA: CriterionDef[] = [
  { field: 'education_levels', weight: 30, description: 'Education level eligibility' },
  { field: 'skills', weight: 25, description: 'Interest match' },
  { field: 'status', weight: 20, description: 'Registration open' },
  { field: 'location', weight: 15, description: 'Location preference' },
  { field: 'registration_fee', weight: 10, description: 'Budget fit' }
];

const norm = (value?: string | null): string => (value ?? '').trim().toLowerCase();

function evaluateCriterion(
  criterion: CriterionDef,
  student: StudentEventProfile,
  event: EventRecord
): { state: CriterionState; detail: string } {
  switch (criterion.field) {
    case 'education_levels': {
      if (
        !event.education_levels ||
        event.education_levels.length === 0 ||
        event.education_levels.includes('Any')
      ) {
        return { state: 'unknown', detail: 'Education level eligibility not specified' };
      }
      const met = event.education_levels.includes(student.educationLevel);
      return {
        state: met ? 'met' : 'notMet',
        detail: met
          ? `Open to ${student.educationLevel} students`
          : `Open to ${event.education_levels.join(' / ')} students, you are ${student.educationLevel}`
      };
    }

    case 'skills': {
      const hasInterests = student.interests.length > 0;
      if (!hasInterests || event.skills.length === 0) {
        return { state: 'unknown', detail: 'No interest information to compare' };
      }
      const overlap = student.interests.filter(interest =>
        event.skills.some(skill => norm(skill) === norm(interest))
      );
      if (overlap.length > 0) {
        return { state: 'met', detail: `Matches your interests: ${overlap.join(', ')}` };
      }
      return {
        state: 'notMet',
        detail: `Focuses on ${event.skills.join(', ')}, outside your listed interests`
      };
    }

    case 'status': {
      switch (event.status) {
        case 'REGISTRATION_OPEN':
          return {
            state: 'met',
            detail: event.registration_deadline
              ? `Registration closes ${new Date(event.registration_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
              : 'Registration currently open'
          };
        case 'ONGOING':
          return { state: 'notMet', detail: 'Event happening right now - registration closed' };
        case 'UPCOMING':
        case 'REGISTRATION_CLOSED':
          return { state: 'notMet', detail: 'Registration is not currently open' };
        case 'COMPLETED':
        case 'CANCELLED':
          return { state: 'notMet', detail: 'This opportunity has already ended' };
        case 'UNKNOWN':
        default:
          return { state: 'unknown', detail: 'Current status could not be confirmed' };
      }
    }

    case 'location': {
      if (norm(student.preferredLocation) === 'anywhere') {
        return { state: 'met', detail: 'You accepted any location' };
      }
      if (norm(event.location) === 'nationwide' || event.format === 'ONLINE') {
        return { state: 'met', detail: `Accessible from anywhere (${norm(event.location) === 'nationwide' ? 'nationwide program' : 'online'})` };
      }
      const met = norm(event.location) === norm(student.preferredLocation);
      return {
        state: met ? 'met' : 'notMet',
        detail: met
          ? `Happens in ${event.location}`
          : `Based in ${event.location}, you prefer ${student.preferredLocation}`
      };
    }

    case 'registration_fee': {
      if (student.budgetPreference !== 'Free only') {
        // Preference accepts any cost, so this criterion does not apply
        return { state: 'unknown', detail: 'No budget restriction applied' };
      }
      if (event.registration_fee === null) {
        return {
          state: 'unknown',
          detail: event.fee_note
            ? `Cost unclear (${event.fee_note})`
            : 'Fee information unclear'
        };
      }
      if (event.registration_fee === 0) {
        return { state: 'met', detail: 'Free to participate' };
      }
      return {
        state: 'notMet',
        detail: `Registration fee NPR ${event.registration_fee.toLocaleString()} applies`
      };
    }

    default:
      return { state: 'unknown', detail: 'Criterion not evaluated' };
  }
}

export function calculateEventMatch(
  student: StudentEventProfile,
  event: EventRecord
): EventMatchResult {
  const met: MatchExplanationItem[] = [];
  const notMet: MatchExplanationItem[] = [];
  const unknown: MatchExplanationItem[] = [];

  let earnedPoints = 0;
  let applicablePoints = 0;

  for (const criterion of EVENT_MATCH_CRITERIA) {
    const evaluation = evaluateCriterion(criterion, student, event);

    if (evaluation.state !== 'unknown') {
      applicablePoints += criterion.weight;
    }
    if (evaluation.state === 'met') {
      earnedPoints += criterion.weight;
    }

    const item: MatchExplanationItem = {
      field: criterion.field,
      description: criterion.description,
      detail: evaluation.detail,
      points: evaluation.state === 'met' ? criterion.weight : 0,
      weight: criterion.weight
    };

    if (evaluation.state === 'met') met.push(item);
    else if (evaluation.state === 'notMet') notMet.push(item);
    else unknown.push(item);
  }

  const score =
    applicablePoints > 0 ? Math.round((earnedPoints / applicablePoints) * 100) : 0;

  let recommendation: string;
  if (score >= 80 && notMet.length === 0) {
    recommendation = 'Strong match! This event aligns well with your profile.';
  } else if (score >= 80) {
    recommendation = 'Good match, but check the flagged points before committing.';
  } else if (score >= 60) {
    recommendation = 'Moderate match - review why before deciding.';
  } else if (score >= 40) {
    recommendation = 'Weak match for your current profile.';
  } else {
    recommendation = 'Not a good fit right now.';
  }
  if (unknown.length > 0) {
    recommendation += ` ${unknown.length} detail${unknown.length > 1 ? 's' : ''} unconfirmed - verify with the organizer.`;
  }
  if (event.verification_status === 'UNVERIFIED') {
    recommendation =
      '⚠ Organizer not independently verified - inspect the source before registering. ' +
      recommendation;
  }

  return {
    eventId: event.id,
    score,
    earnedPoints,
    applicablePoints,
    met,
    notMet,
    unknown,
    recommendation
  };
}

export function getEventMatches(
  student: StudentEventProfile,
  events: EventRecord[],
  options?: { includePast?: boolean }
): RankedEvent[] {
  const includePast = options?.includePast ?? false;

  return events
    .filter(event => {
      if (event.status === 'CANCELLED') return false;
      if (!includePast && event.status === 'COMPLETED') return false;
      return true;
    })
    .filter(event => matchesParticipationPreference(student.participationPreference, event.participation))
    .map(event => ({ ...calculateEventMatch(student, event), event }))
    .sort((a, b) => b.score - a.score);
}

function matchesParticipationPreference(
  preference: 'Team' | 'Individual' | 'Either',
  mode: ParticipationMode
): boolean {
  if (preference === 'Either') return true;
  if (preference === 'Team') return mode === 'TEAM' || mode === 'BOTH';
  return mode === 'INDIVIDUAL' || mode === 'BOTH';
}

export function formatFee(event: EventRecord): string {
  if (event.registration_fee === 0) return 'Free';
  if (event.registration_fee === null) return event.fee_note ?? 'Cost not published';
  return `NPR ${event.registration_fee.toLocaleString()}`;
}

export function daysUntil(isoDate: string): number {
  return Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86400000);
}

export function formatEventDate(isoDate: string | null): string {
  if (!isoDate) return 'TBA';
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

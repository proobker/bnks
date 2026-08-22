// Nepal Student Events & Competitions Finder - data model per
// BNKS_Hackathon_Student_Events_Competitions_MVP.md event schema.
export type EventType =
  | 'HACKATHON'
  | 'COMPETITION'
  | 'WORKSHOP'
  | 'BOOTCAMP'
  | 'SEMINAR'
  | 'CONFERENCE'
  | 'CAREER_EVENT'
  | 'VOLUNTEERING'
  | 'NETWORKING'
  | 'OTHER';

export type EventFormat = 'ONLINE' | 'PHYSICAL' | 'HYBRID' | 'UNKNOWN';

export type ParticipationMode = 'INDIVIDUAL' | 'TEAM' | 'BOTH' | 'UNKNOWN';

export type EventStatus =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'UNKNOWN';

export type OrganizationType =
  | 'student_club'
  | 'college'
  | 'university'
  | 'school'
  | 'ngo'
  | 'ingo'
  | 'youth_organization'
  | 'tech_community'
  | 'professional_association'
  | 'company'
  | 'government'
  | 'municipality'
  | 'community_organization';

// Lifecycle verification is separate from organizer trust; EXPIRED events are
// tracked via status, not verification.
export type VerificationStatus = 'VERIFIED' | 'CROSS_CHECKED' | 'UNVERIFIED';

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  organization_name: string;
  organization_type: OrganizationType;
  event_type: EventType;
  category: string; // e.g. 'Hackathon', 'Robotics', 'Olympiad', 'Economics'
  skills: string[]; // matched against student interests
  location: string; // 'Kathmandu', 'Rupandehi', 'Nationwide'
  district: string | null;
  province: string | null;
  venue: string | null;
  format: EventFormat;
  start_date: string | null; // ISO date
  end_date: string | null; // ISO date
  registration_deadline: string | null; // ISO date, null when unpublished/varies
  registration_url: string | null;
  contact_information: string | null;
  eligibility: string;
  education_levels: EducationLevel[];
  participation: ParticipationMode;
  team_size_min: number | null;
  team_size_max: number | null;
  registration_fee: number | null; // NPR amount, 0 = free, null = unknown
  fee_note: string | null;
  prize_information: string | null;
  certificate_available: boolean | null;
  benefits: string[];
  source_url: string;
  source_type: 'official_website' | 'education_portal' | 'news_portal' | 'social_media' | 'pdf';
  verification_status: VerificationStatus;
  last_verified: string;
  status: EventStatus;
  notes: string;
}

export type EducationLevel = 'School' | '+2' | "Bachelor's" | 'Masters' | 'Any';

export interface StudentEventProfile {
  educationLevel: EducationLevel;
  interests: string[];
  preferredLocation: string; // 'Anywhere' accepted
  budgetPreference: 'Free only' | 'Any';
  participationPreference: 'Team' | 'Individual' | 'Either';
}

export type CriterionState = 'met' | 'notMet' | 'unknown';

export interface MatchExplanationItem {
  field: string;
  description: string;
  detail: string;
  points: number;
  weight: number;
}

export interface EventMatchResult {
  eventId: string;
  score: number;
  earnedPoints: number;
  applicablePoints: number;
  met: MatchExplanationItem[];
  notMet: MatchExplanationItem[];
  unknown: MatchExplanationItem[];
  recommendation: string;
}

export interface RankedEvent extends EventMatchResult {
  event: EventRecord;
}

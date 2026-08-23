'use client';

import { useMemo, useState, useEffect } from 'react';
import { events } from '@/data/events';
import {
  getEventMatches,
  formatFee,
  formatEventDate,
  daysUntil
} from '@/lib/event-matching';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type {
  RankedEvent,
  StudentEventProfile,
  EducationLevel,
  VerificationStatus,
  EventStatus
} from '@/lib/event-types';

const interestOptions = [
  'Programming',
  'AI',
  'Robotics',
  'IoT',
  'Entrepreneurship',
  'Science',
  'Economics',
  'Innovation'
];

const educationLevels: EducationLevel[] = ['School', '+2', "Bachelor's", 'Masters'];
const locations = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Rupandehi', 'Anywhere'];

const defaultProfile: StudentEventProfile = {
  educationLevel: "Bachelor's",
  interests: ['Programming', 'AI', 'Entrepreneurship'],
  preferredLocation: 'Kathmandu',
  budgetPreference: 'Any',
  participationPreference: 'Either'
};

const NO_SAVES: Set<string> = new Set();

const verificationStyles: Record<VerificationStatus, string> = {
  VERIFIED: 'bg-green-100 text-green-800 border-green-300',
  CROSS_CHECKED: 'bg-blue-100 text-blue-800 border-blue-300',
  UNVERIFIED: 'bg-amber-100 text-amber-900 border-amber-300'
};

const statusStyles: Record<EventStatus, string> = {
  UPCOMING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  REGISTRATION_OPEN: 'bg-green-50 text-green-700 border-green-200',
  REGISTRATION_CLOSED: 'bg-gray-100 text-gray-600 border-gray-200',
  ONGOING: 'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED: 'bg-gray-100 text-gray-500 border-gray-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
  UNKNOWN: 'bg-amber-50 text-amber-800 border-amber-200'
};

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

function scoreBarColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export default function EventFinder() {
  const { user } = useAuth();
  const [form, setForm] = useState<StudentEventProfile>(defaultProfile);
  const [student, setStudent] = useState<StudentEventProfile>(defaultProfile);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openOnly, setOpenOnly] = useState(true);
  const [includePast, setIncludePast] = useState(false);
  const [supabase] = useState(() => createBrowserSupabaseClient());

  // Personal saves - viewing is public, saving requires login
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loginPromptId, setLoginPromptId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('saved_events')
      .select('event_id')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) setSavedIds(new Set(data.map(row => row.event_id)));
      });
  }, [user, supabase]);

  // Logged-out visitors never see persisted saves
  const visibleSaved = user ? savedIds : NO_SAVES;

  const toggleSave = async (eventId: string) => {
    if (!user) {
      setLoginPromptId(prev => (prev === eventId ? null : eventId));
      return;
    }
    const isSaved = savedIds.has(eventId);
    const next = new Set(savedIds);
    if (isSaved) next.delete(eventId);
    else next.add(eventId);
    setSavedIds(next);

    const query = isSaved
      ? supabase.from('saved_events').delete().eq('user_id', user.id).eq('event_id', eventId)
      : supabase.from('saved_events').insert({ user_id: user.id, event_id: eventId });

    const { error } = await query;
    if (error) {
      setSavedIds(savedIds); // rollback
      setSaveError('Could not update your saved events. Please try again.');
      setTimeout(() => setSaveError(null), 4000);
    }
  };

  const allMatches = useMemo(
    () => getEventMatches(student, events, { includePast }),
    [student, includePast]
  );

  const visibleMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allMatches.filter(({ event }) => {
      if (openOnly && event.status !== 'REGISTRATION_OPEN') return false;
      if (
        query &&
        !event.title.toLowerCase().includes(query) &&
        !event.organization_name.toLowerCase().includes(query) &&
        !event.category.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });
  }, [allMatches, openOnly, searchQuery]);

  const toggleInterest = (interest: string) =>
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudent(form);
  };

  const renderExplanations = (match: RankedEvent) => (
    <div className="space-y-1">
      {match.met.map(item => (
        <li key={item.field} className="text-sm text-green-700">
          ✓ {item.detail} ({item.points}/{item.weight} points)
        </li>
      ))}
      {match.notMet.map(item => (
        <li key={item.field} className="text-sm text-red-600">
          ✗ {item.description}: {item.detail}
        </li>
      ))}
      {match.unknown.map(item => (
        <li key={item.field} className="text-sm text-amber-600">
          ? {item.description}: {item.detail}
        </li>
      ))}
    </div>
  );

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-800 flex items-center">
        <span className="mr-2">🏆</span> Nepal Student Events & Competitions Finder
      </h2>
      <p className="text-sm text-gray-600 mt-1 mb-4">
        Discover hackathons, competitions and workshops near you - with verified
        sources, deadlines and transparent match explanations.
      </p>

      {/* Student profile form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-indigo-50 rounded-lg p-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Education level</label>
          <select
            value={form.educationLevel}
            onChange={e => setForm({ ...form, educationLevel: e.target.value as EducationLevel })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
          <select
            value={form.preferredLocation}
            onChange={e => setForm({ ...form, preferredLocation: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Budget</label>
          <select
            value={form.budgetPreference}
            onChange={e =>
              setForm({ ...form, budgetPreference: e.target.value as 'Free only' | 'Any' })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="Any">Any cost</option>
            <option value="Free only">Free only</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Participation</label>
          <select
            value={form.participationPreference}
            onChange={e =>
              setForm({
                ...form,
                participationPreference: e.target.value as 'Team' | 'Individual' | 'Either'
              })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="Either">Either</option>
            <option value="Team">Team events</option>
            <option value="Individual">Individual</option>
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Interests</label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  form.interests.includes(interest)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Find Events
          </button>
        </div>
      </form>

      {/* Search & filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search event, organizer or category..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[220px] border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={e => setOpenOnly(e.target.checked)}
            className="h-4 w-4"
          />
          Registration open only
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={includePast}
            onChange={e => setIncludePast(e.target.checked)}
            className="h-4 w-4"
          />
          Show past events
        </label>
      </div>

      {/* Results */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        Your Event Matches ({visibleMatches.length})
        {user && visibleSaved.size > 0 && (
          <span className="ml-2 text-sm font-normal text-rose-500">♥ {visibleSaved.size} saved</span>
        )}
      </h3>
      {!user && (
        <p className="text-xs text-gray-500 mb-4">
          Browsing is free — log in to save events to your personal list.
        </p>
      )}

      {saveError && (
        <p className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{saveError}</p>
      )}

      {visibleMatches.length === 0 ? (
        <p className="text-gray-500 text-center py-12 bg-white rounded-lg border">
          No events match your filters. Try widening your criteria or enabling past events.
        </p>
      ) : (
        <div className="space-y-4">
          {visibleMatches.map(match => {
            const ev = match.event;
            const isExpanded = expandedId === ev.id;
            const deadlineDays =
              ev.registration_deadline && ev.status === 'REGISTRATION_OPEN'
                ? daysUntil(ev.registration_deadline)
                : null;
            return (
              <div key={ev.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{ev.title}</h4>
                    <p className="text-sm text-gray-600">
                      Organized by {ev.organization_name}
                      {deadlineDays !== null && (
                        <span className={deadlineDays <= 7 ? ' text-red-600 font-medium' : ' text-gray-500'}>
                          {' '}· closes in {deadlineDays} day{deadlineDays === 1 ? '' : 's'}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${statusStyles[ev.status]}`}>
                        {ev.status.replace(/_/g, ' ')}
                      </span>
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${verificationStyles[ev.verification_status]}`}>
                        {ev.verification_status === 'UNVERIFIED'
                          ? '⚠ Unverified organizer'
                          : ev.verification_status === 'CROSS_CHECKED'
                            ? '✓ Cross-checked'
                            : '✓ Verified'}
                      </span>
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {ev.event_type} · {ev.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${scoreColor(match.score)}`}>
                      {match.score}%
                    </div>
                    <p className="text-xs text-gray-500">Match ({match.earnedPoints}/{match.applicablePoints} pts)</p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                  <div
                    className={`h-2.5 rounded-full ${scoreBarColor(match.score)} transition-all duration-500`}
                    style={{ width: `${match.score}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{ev.description}</p>

                <div className="mb-3">
                  <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Why this matches you:</h5>
                  <ul className="list-none space-y-0.5">{renderExplanations(match)}</ul>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
                  <p><strong className="text-gray-700">Deadline:</strong> {formatEventDate(ev.registration_deadline)}</p>
                  <p><strong className="text-gray-700">When:</strong> {formatEventDate(ev.start_date)}{ev.end_date ? ` – ${formatEventDate(ev.end_date)}` : ''}</p>
                  <p><strong className="text-gray-700">Where:</strong> {ev.location}{ev.format !== 'UNKNOWN' ? ` (${ev.format.toLowerCase()})` : ''}</p>
                  <p><strong className="text-gray-700">Entry:</strong> {formatFee(ev)}</p>
                </div>

                {(ev.prize_information || ev.certificate_available) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {ev.prize_information && (
                      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200">
                        🏅 {ev.prize_information.split(';')[0].split(' incl.')[0]}
                      </span>
                    )}
                    {ev.certificate_available && (
                      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        📜 Certificate available
                      </span>
                    )}
                  </div>
                )}

                <p className="text-sm italic text-gray-600 mb-3">{match.recommendation}</p>

                {isExpanded && (
                  <div className="border-t border-gray-100 pt-3 mt-3 text-sm text-gray-700 space-y-1">
                    <p><strong>Eligibility:</strong> {ev.eligibility}</p>
                    {ev.participation !== 'UNKNOWN' && (
                      <p>
                        <strong>Participation:</strong>{' '}
                        {ev.participation === 'TEAM'
                          ? `Team of ${ev.team_size_min ?? '?'}${ev.team_size_max && ev.team_size_max !== ev.team_size_min ? `–${ev.team_size_max}` : ''}`
                          : ev.participation === 'BOTH'
                            ? 'Individual or team'
                            : 'Individual'}
                      </p>
                    )}
                    {ev.fee_note && <p><strong>Cost details:</strong> {ev.fee_note}</p>}
                    {ev.contact_information && <p><strong>Contact:</strong> {ev.contact_information}</p>}
                    {ev.benefits.length > 0 && <p><strong>Benefits:</strong> {ev.benefits.join(', ')}</p>}
                    <p>
                      <strong>Source:</strong>{' '}
                      <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline break-all">
                        {ev.source_url}
                      </a>{' '}
                      ({ev.source_type}, checked {ev.last_verified})
                    </p>
                    {ev.registration_url && ev.status === 'REGISTRATION_OPEN' && (
                      <a
                        href={ev.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-4 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                      >
                        Register / Apply →
                      </a>
                    )}
                    {ev.notes && <p className="text-gray-500"><strong>Notes:</strong> {ev.notes}</p>}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleSave(ev.id)}
                    className={`text-sm font-medium px-3 py-1.5 rounded-md border transition-colors ${
                      visibleSaved.has(ev.id)
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {visibleSaved.has(ev.id) ? '♥ Saved' : '♡ Save'}
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {isExpanded ? 'Hide Details ↑' : 'View Details ↓'}
                  </button>
                </div>

                {loginPromptId === ev.id && !user && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                    Log in to save events to your personal list.{' '}
                    <a href="/student-login" className="font-medium underline text-indigo-600 hover:text-indigo-800">
                      Log in
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

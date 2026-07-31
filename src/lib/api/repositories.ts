import * as db from "../mock/data";
import type {
  AIAsset,
  AuditEvent,
  CommunitySignal,
  LearningTrack,
  ListQuery,
  MessageThread,
  MissionMetric,
  NotificationItem,
  Opportunity,
  Organization,
  Paginated,
  Professional,
  Project,
  SeriesPoint,
  SessionUser,
  UniverseGraph,
} from "../types";
import { paginate, request } from "./transport";

/**
 * Repository layer.
 *
 * Screens never touch data modules directly — they consume repositories via
 * query options in `src/lib/queries.ts`. Each method maps 1:1 to a future REST
 * endpoint, including its list-query contract.
 */

export const sessionRepository = {
  current: (): Promise<SessionUser> => request(() => db.session, { latency: 120 }),
};

export const professionalsRepository = {
  list: (query: ListQuery = {}): Promise<Paginated<Professional>> =>
    request(() =>
      paginate(db.professionals, query, {
        searchKeys: ["name", "title", "headline", "location", "region"],
        sorters: {
          index: (a, b) => (b.capabilityIndex as number) - (a.capabilityIndex as number),
          proof: (a, b) => (b.proofRatio as number) - (a.proofRatio as number),
          name: (a, b) => String(a.name).localeCompare(String(b.name)),
        },
      }),
    ),
  byHandle: (handle: string): Promise<Professional> =>
    request(() => db.professionals.find((p) => p.handle === handle) as Professional),
};

export const organizationsRepository = {
  list: (query: ListQuery = {}): Promise<Paginated<Organization>> =>
    request(() =>
      paginate(db.organizations, query, {
        searchKeys: ["name", "summary", "headquarters", "focus", "region"],
        sorters: {
          trust: (a, b) => (b.trustIndex as number) - (a.trustIndex as number),
          people: (a, b) => (b.people as number) - (a.people as number),
          name: (a, b) => String(a.name).localeCompare(String(b.name)),
        },
      }),
    ),
  bySlug: (slug: string): Promise<Organization> =>
    request(() => db.organizations.find((o) => o.slug === slug) as Organization),
};

export const assetsRepository = {
  list: (query: ListQuery = {}): Promise<Paginated<AIAsset>> =>
    request(() =>
      paginate(db.assets, query, {
        searchKeys: ["name", "owner", "summary", "license", "category"],
        sorters: {
          adoption: (a, b) => (b.adoption as number) - (a.adoption as number),
          evaluations: (a, b) => (b.evaluations as number) - (a.evaluations as number),
          name: (a, b) => String(a.name).localeCompare(String(b.name)),
        },
      }),
    ),
};

export const opportunitiesRepository = {
  list: (query: ListQuery = {}): Promise<Paginated<Opportunity>> =>
    request(() =>
      paginate(db.opportunities, query, {
        searchKeys: ["title", "organization", "summary", "location", "requiredDomains"],
        sorters: {
          match: (a, b) => (b.matchScore as number) - (a.matchScore as number),
          recent: (a, b) => String(b.postedAt).localeCompare(String(a.postedAt)),
          threshold: (a, b) => (a.proofThreshold as number) - (b.proofThreshold as number),
        },
      }),
    ),
  byId: (id: string): Promise<Opportunity> =>
    request(() => db.opportunities.find((o) => o.id === id) as Opportunity),
};

export const projectsRepository = {
  list: (query: ListQuery = {}): Promise<Paginated<Project>> =>
    request(() =>
      paginate(db.projects, query, {
        searchKeys: ["name", "organization", "summary", "domain"],
        sorters: {
          progress: (a, b) => (b.progress as number) - (a.progress as number),
          recent: (a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)),
        },
      }),
    ),
};

export const notificationsRepository = {
  list: (): Promise<NotificationItem[]> => request(() => db.notifications, { latency: 200 }),
  markAllRead: (): Promise<NotificationItem[]> =>
    request(() => db.notifications.map((n) => ({ ...n, read: true })), { latency: 260 }),
};

export const messagesRepository = {
  threads: (): Promise<MessageThread[]> => request(() => db.threads, { latency: 240 }),
  send: (threadId: string, body: string): Promise<MessageThread> =>
    request(() => {
      const thread = db.threads.find((t) => t.id === threadId)!;
      return {
        ...thread,
        unread: 0,
        messages: [
          ...thread.messages,
          { id: `m-${thread.messages.length + 1}`, from: "me" as const, body, at: new Date().toISOString() },
        ],
      };
    }, { latency: 420 }),
};

export const analyticsRepository = {
  metrics: (): Promise<MissionMetric[]> => request(() => db.missionMetrics, { latency: 200 }),
  proofSeries: (): Promise<SeriesPoint[]> => request(() => db.proofSeries, { latency: 260 }),
  presence: () => request(() => db.worldPresence, { latency: 180 }),
};

export const universeRepository = {
  graph: (): Promise<UniverseGraph> => request(() => db.universeGraph, { latency: 340 }),
};

export const learningRepository = {
  tracks: (): Promise<LearningTrack[]> => request(() => db.learningTracks, { latency: 220 }),
};

export const communityRepository = {
  signals: (): Promise<CommunitySignal[]> => request(() => db.communitySignals, { latency: 220 }),
};

export const adminRepository = {
  audit: (): Promise<AuditEvent[]> => request(() => db.auditEvents, { latency: 200 }),
};

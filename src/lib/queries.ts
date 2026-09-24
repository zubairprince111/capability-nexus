import { queryOptions } from "@tanstack/react-query";

import {
  adminRepository,
  analyticsRepository,
  assetsRepository,
  buyerRepository,
  commerceRepository,
  communityRepository,
  learningRepository,
  messagesRepository,
  notificationsRepository,
  opportunitiesRepository,
  organizationServiceRepository,
  organizationsRepository,
  professionalsRepository,
  projectsRepository,
  sessionRepository,
  universeRepository,
} from "./api/repositories";
import type { ListQuery } from "./types";

/** Canonical query keys — one namespace per resource, list keys carry the query. */
export const queryKeys = {
  session: ["session"] as const,
  professionals: (q: ListQuery = {}) => ["professionals", q] as const,
  professional: (handle: string) => ["professional", handle] as const,
  organizations: (q: ListQuery = {}) => ["organizations", q] as const,
  organization: (slug: string) => ["organization", slug] as const,
  assets: (q: ListQuery = {}) => ["assets", q] as const,
  opportunities: (q: ListQuery = {}) => ["opportunities", q] as const,
  opportunity: (id: string) => ["opportunity", id] as const,
  projects: (q: ListQuery = {}) => ["projects", q] as const,
  notifications: ["notifications"] as const,
  threads: ["threads"] as const,
  metrics: ["metrics"] as const,
  proofSeries: ["proof-series"] as const,
  presence: ["presence"] as const,
  universe: ["universe"] as const,
  learning: ["learning"] as const,
  community: ["community"] as const,
  audit: ["audit"] as const,
  proposals: ["proposals"] as const,
  contracts: ["contracts"] as const,
  payments: ["payments"] as const,
  requirements: ["requirements"] as const,
  matches: ["matches"] as const,
  reviews: ["reviews"] as const,
  deliveryPods: ["delivery-pods"] as const,
  marketplaceListings: ["marketplace-listings"] as const,
};

export const sessionQuery = () =>
  queryOptions({ queryKey: queryKeys.session, queryFn: () => sessionRepository.current() });

export const professionalsQuery = (q: ListQuery = {}) =>
  queryOptions({ queryKey: queryKeys.professionals(q), queryFn: () => professionalsRepository.list(q) });

export const professionalQuery = (handle: string) =>
  queryOptions({ queryKey: queryKeys.professional(handle), queryFn: () => professionalsRepository.byHandle(handle) });

export const organizationsQuery = (q: ListQuery = {}) =>
  queryOptions({ queryKey: queryKeys.organizations(q), queryFn: () => organizationsRepository.list(q) });

export const organizationQuery = (slug: string) =>
  queryOptions({ queryKey: queryKeys.organization(slug), queryFn: () => organizationsRepository.bySlug(slug) });

export const assetsQuery = (q: ListQuery = {}) =>
  queryOptions({ queryKey: queryKeys.assets(q), queryFn: () => assetsRepository.list(q) });

export const opportunitiesQuery = (q: ListQuery = {}) =>
  queryOptions({ queryKey: queryKeys.opportunities(q), queryFn: () => opportunitiesRepository.list(q) });

export const opportunityQuery = (id: string) =>
  queryOptions({ queryKey: queryKeys.opportunity(id), queryFn: () => opportunitiesRepository.byId(id) });

export const projectsQuery = (q: ListQuery = {}) =>
  queryOptions({ queryKey: queryKeys.projects(q), queryFn: () => projectsRepository.list(q) });

export const notificationsQuery = () =>
  queryOptions({ queryKey: queryKeys.notifications, queryFn: () => notificationsRepository.list() });

export const threadsQuery = () =>
  queryOptions({ queryKey: queryKeys.threads, queryFn: () => messagesRepository.threads() });

export const metricsQuery = () =>
  queryOptions({ queryKey: queryKeys.metrics, queryFn: () => analyticsRepository.metrics() });

export const proofSeriesQuery = () =>
  queryOptions({ queryKey: queryKeys.proofSeries, queryFn: () => analyticsRepository.proofSeries() });

export const presenceQuery = () =>
  queryOptions({ queryKey: queryKeys.presence, queryFn: () => analyticsRepository.presence() });

export const universeQuery = () =>
  queryOptions({ queryKey: queryKeys.universe, queryFn: () => universeRepository.graph() });

export const learningQuery = () =>
  queryOptions({ queryKey: queryKeys.learning, queryFn: () => learningRepository.tracks() });

export const communityQuery = () =>
  queryOptions({ queryKey: queryKeys.community, queryFn: () => communityRepository.signals() });

export const auditQuery = () =>
  queryOptions({ queryKey: queryKeys.audit, queryFn: () => adminRepository.audit() });

export const proposalsQuery = () =>
  queryOptions({ queryKey: queryKeys.proposals, queryFn: () => commerceRepository.proposals() });

export const contractsQuery = () =>
  queryOptions({ queryKey: queryKeys.contracts, queryFn: () => commerceRepository.contracts() });

export const paymentsQuery = () =>
  queryOptions({ queryKey: queryKeys.payments, queryFn: () => commerceRepository.payments() });

export const buyerRequirementsQuery = () =>
  queryOptions({ queryKey: queryKeys.requirements, queryFn: () => buyerRepository.requirements() });

export const buyerMatchesQuery = () =>
  queryOptions({ queryKey: queryKeys.matches, queryFn: () => buyerRepository.matches() });

export const buyerReviewsQuery = () =>
  queryOptions({ queryKey: queryKeys.reviews, queryFn: () => buyerRepository.reviews() });

export const deliveryPodsQuery = () =>
  queryOptions({ queryKey: queryKeys.deliveryPods, queryFn: () => organizationServiceRepository.deliveryPods() });

export const marketplaceListingsQuery = () =>
  queryOptions({ queryKey: queryKeys.marketplaceListings, queryFn: () => commerceRepository.marketplaceListings() });

// Sync status thresholds in minutes
export const SYNC_THRESHOLDS = {
  HEALTHY_MAX_MINUTES: 60,       // last sync < 60 minutes ago
  STALE_MAX_MINUTES: 360,        // last sync between 1-6 hours ago (60 to 360 mins)
  // Error state is > 360 minutes (6 hours) or explicitly marked as failed
};

// ─────────────────────────────────────────────────────────────────────────────
// INBIOLOGY ACADEMY — SUPABASE POSTGRESQL CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
// Pure Vanilla JS client integration (No heavy external dependencies needed)
// Uses high-performance native fetch to connect directly to Supabase PostgREST.
// ─────────────────────────────────────────────────────────────────────────────

window.SUPABASE_CONFIG = {
  url: 'https://nxiwrlczhvnaxptqitcg.supabase.co',
  publishableKey: 'sb_publishable_9QNGW87ttxOwcYzbtn8oUA_H11zvWSW'
};

window.isSupabaseConfigured = function() {
  const cfg = window.SUPABASE_CONFIG;
  return Boolean(cfg && cfg.url && cfg.publishableKey && cfg.url.includes('supabase.co'));
};

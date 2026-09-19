import { eventHandler, getQuery } from 'h3';

const DEFAULT_TARGETS = ['http://127.0.0.1:8000', 'http://localhost:8000'];

function backendTargets() {
  const configured = process.env.LINJING_API_TARGET?.replace(/\/$/, '');
  const targets = configured ? [configured] : [];
  for (const fallback of DEFAULT_TARGETS) {
    if (!targets.includes(fallback)) {
      targets.push(fallback);
    }
  }
  return targets;
}

function withQuery(target: string, query: Record<string, unknown>) {
  const url = new URL('/api/admin/app-users', target);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    url.searchParams.set(key, String(value));
  }
  return url;
}

export default eventHandler(async (event) => {
  const query = getQuery(event);

  for (const target of backendTargets()) {
    try {
      const response = await fetch(withQuery(target, query), {
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) {
        continue;
      }
      return await response.json();
    } catch {
      // try the next local backend URL
    }
  }

  return {
    code: 0,
    message: 'ok',
    data: {
      backendOffline: true,
      items: [],
      total: 0,
    },
  };
});

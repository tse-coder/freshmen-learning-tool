export { resourcesCache as resourcesStore, ensureResources } from './cacheContext';

// NOTE: `resourcesStore` re-exports the new cache-backed `resourcesCache` for backward compatibility.
// Use `ensureResources(courseId)` to guarantee loading when needed.

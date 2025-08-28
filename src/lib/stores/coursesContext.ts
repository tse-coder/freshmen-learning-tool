export { coursesCache as coursesStore, ensureCourses } from './cacheContext';

// NOTE: `coursesStore` re-exports the new cache-backed `coursesCache` for backward compatibility.
// Prefer using `ensureCourses()` from `cacheContext` to load data when needed.

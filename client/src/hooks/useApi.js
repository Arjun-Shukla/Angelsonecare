/**
 * useApi — generic data-fetching hook.
 *
 * Purpose: Wrap an API call with loading/error/data state and a refetch fn.
 * TODO (implementation): manage { data, loading, error, refetch }.
 */

export const useApi = (apiFn, deps = []) => {
  // const [state, setState] = useState({ data: null, loading: true, error: null });
  return { data: null, loading: false, error: null, refetch: () => {} };
};

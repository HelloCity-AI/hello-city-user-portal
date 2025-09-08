/**
 * Jest unit tests for the Redux Toolkit user slice.
 * Testing library/framework: Jest (TypeScript).
 *
 * Validates:
 * - Initial state shape and defaults
 * - setUser, logOut, setLoading, setError reducers
 * - fetchUser no-op reducer behavior
 * - Unknown action behavior (returns same state reference)
 * - Immutability characteristics for known vs unknown actions
 */
import reducer, { setUser, logOut, setLoading, fetchUser, setError } from "../../src/store/slices/user";

type AnyUser = any;

describe("user slice", () => {
  const initialState = {
    isLoading: false,
    userData: undefined as AnyUser,
    error: "",
  };

  it("returns the initial state when called with undefined state", () => {
    // @ts-expect-error intentional undefined state to test reducer initialization
    const state = reducer(undefined, { type: "@@INIT" } as any);
    expect(state).toEqual(initialState);
  });

  describe("setUser", () => {
    it("sets userData and clears error", () => {
      const prev = { ...initialState, error: "Some error" };
      const user = { id: "123", name: "Alice" } as AnyUser;
      const next = reducer(prev, setUser(user));
      expect(next.userData).toEqual(user);
      expect(next.error).toBe("");
      expect(next.isLoading).toBe(false);
    });

    it("accepts null and clears error", () => {
      const prev = { ...initialState, error: "Bad", userData: { id: "old" } as AnyUser };
      const next = reducer(prev, setUser(null));
      expect(next.userData).toBeNull();
      expect(next.error).toBe("");
    });

    it("produces a new state object when user changes", () => {
      const prev = { ...initialState, userData: { id: "old" } as AnyUser };
      const next = reducer(prev, setUser({ id: "new" } as AnyUser));
      expect(next).not.toBe(prev);
    });
  });

  describe("logOut", () => {
    it("sets userData to null and preserves other fields", () => {
      const prev = { ...initialState, userData: { id: "u2" } as AnyUser, error: "keep" };
      const next = reducer(prev, logOut());
      expect(next.userData).toBeNull();
      expect(next.error).toBe("keep");
      expect(next.isLoading).toBe(false);
    });

    it("returns a new state object when logging out (mutation via Immer)", () => {
      const prev = { ...initialState, userData: { id: "x" } as AnyUser };
      const next = reducer(prev, logOut());
      expect(next).not.toBe(prev);
    });
  });

  describe("setLoading", () => {
    it("updates isLoading to true then false without affecting others", () => {
      const s1 = reducer(initialState, setLoading(true));
      expect(s1.isLoading).toBe(true);
      expect(s1.userData).toBeUndefined();
      expect(s1.error).toBe("");

      const s2 = reducer(s1, setLoading(false));
      expect(s2.isLoading).toBe(false);
      expect(s2.userData).toBeUndefined();
      expect(s2.error).toBe("");
    });

    it("produces a new state object when toggling loading", () => {
      const prev = { ...initialState };
      const next = reducer(prev, setLoading(true));
      expect(next).not.toBe(prev);
    });
  });

  describe("setError", () => {
    it("sets the error string", () => {
      const msg = "Failed to fetch";
      const next = reducer(initialState, setError(msg));
      expect(next.error).toBe(msg);
      expect(next.userData).toBeUndefined();
      expect(next.isLoading).toBe(false);
    });

    it("handles empty string gracefully", () => {
      const next = reducer(initialState, setError(""));
      expect(next.error).toBe("");
    });

    it("is cleared by subsequent setUser", () => {
      const withErr = reducer(initialState, setError("Oops"));
      const u = { id: "u1" } as AnyUser;
      const next = reducer(withErr, setUser(u));
      expect(next.error).toBe("");
      expect(next.userData).toEqual(u);
    });

    it("produces a new state object when error changes", () => {
      const prev = { ...initialState };
      const next = reducer(prev, setError("Err"));
      expect(next).not.toBe(prev);
    });
  });

  describe("fetchUser", () => {
    it("is a no-op reducer (does not mutate state, preserves reference)", () => {
      const prev = { ...initialState, userData: { id: "ok" } as AnyUser, isLoading: true, error: "x" };
      const token = "tkn";
      const next = reducer(prev, fetchUser(token));
      // No state changes expected; identity preserved
      expect(next).toBe(prev);
    });
  });

  it("returns same state reference for unknown actions", () => {
    const prev = { ...initialState, userData: null as AnyUser };
    const next = reducer(prev, { type: "UNKNOWN" } as any);
    // Since no case matches and no mutations occur, reference should be identical
    expect(next).toBe(prev);
  });
});
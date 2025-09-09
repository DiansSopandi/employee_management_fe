// lib/ability.ts
import { RootState } from "@/app/redux";

export const hasRole = (
  state: RootState,
  roles: string[] | string
): boolean => {
  const roleList = Array.isArray(roles) ? roles : [roles];
  return state.auth.roles.some((r) => roleList.includes(r.name));
};

export const canAny = (
  state: RootState,
  resource: string,
  action: string[] | string
): boolean => {
  const actionList = Array.isArray(action) ? action : [action];
  return state.auth.permissions.some(
    (p) => p.resource === resource && actionList.includes(p.action)
  );
};

export const canAll = (
  state: RootState,
  resource: string,
  actions: string[]
): boolean => {
  return actions.every((action) =>
    state.auth.permissions.some(
      (p) => p.resource === resource && p.action === action
    )
  );
};

/**
 * Enterprise Role-Based Access Control (RBAC) Engine
 * Canonical roles:
 * - "ADMIN": Super Admin with unrestricted permissions
 * - "SUB_ADMIN": Operational Sub-Admin with read/monitoring permissions
 * - "MEMBER" / "EMPLOYEE": Standard user without administrative access
 */

export type PlatformRole = "ADMIN" | "SUB_ADMIN" | "MEMBER";

export type AdminCapability =
  | "admin.shell"
  | "dashboard.read"
  | "users.read"
  | "users.status.update"
  | "users.plan.update"
  | "media.read"
  | "media.delete"
  | "providers.read"
  | "plans.manage"
  | "subscriptions.manage"
  | "payments.read"
  | "workers.read"
  | "queues.read"
  | "telemetry.read"
  | "system.settings";

/**
 * Normalizes role string cleanly (removes whitespace and uppercases).
 */
export function normalizeRole(role?: string | null): string {
  return role ? role.trim().toUpperCase() : "";
}

/**
 * Validates whether the role has Super Admin authority.
 * Strictly checks for canonical "ADMIN".
 */
export function isSuperAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "ADMIN";
}

/**
 * Validates whether the role has Sub-Admin authority.
 * Strictly checks for canonical "SUB_ADMIN".
 */
export function isSubAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "SUB_ADMIN";
}

/**
 * Validates whether the user is authorized to enter the /admin shell layout.
 */
export function hasAdminAccess(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "ADMIN" || normalized === "SUB_ADMIN";
}

/**
 * Checks whether the given role holds a specific administrative capability.
 * Super Admin: Full wildcard capability.
 * Sub-Admin: Strictly bounded operational capabilities.
 */
export function hasCapability(role: string | null | undefined, capability: AdminCapability): boolean {
  if (isSuperAdmin(role)) {
    return true;
  }

  if (isSubAdmin(role)) {
    const allowedForSubAdmin: AdminCapability[] = [
      "admin.shell",
      "dashboard.read",
      "users.read",
      "media.read",
      "workers.read",
      "queues.read",
      "telemetry.read",
    ];
    return allowedForSubAdmin.includes(capability);
  }

  return false;
}

/**
 * Sub-routes strictly prohibited for Sub-Admin.
 * Any attempt by Sub-Admin to access these routes triggers UX redirection to /admin.
 */
export const RESTRICTED_SUBADMIN_ROUTES = [
  "/admin/plans",
  "/admin/subscriptions",
  "/admin/payments",
  "/admin/providers",
  "/admin/models",
  "/admin/settings",
];

/**
 * Evaluates if a given URL path is restricted for the current user's role.
 */
export function isRouteRestricted(role: string | null | undefined, pathname: string): boolean {
  if (isSuperAdmin(role)) {
    return false;
  }

  if (isSubAdmin(role)) {
    return RESTRICTED_SUBADMIN_ROUTES.some((route) => pathname.startsWith(route));
  }

  // Non-admin roles are restricted from all /admin routes
  return true;
}

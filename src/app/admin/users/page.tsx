"use client";

import { useUsers } from "@/features/admin/hooks/use-users";
import type { User } from "@/features/admin/services/user-service";
import { useUpdateUserStatus } from "@/features/admin/hooks/use-update-user-status";
import { useUpdateUserPlan } from "@/features/admin/hooks/use-update-user-plan";
import { useAuthStore } from "@/stores/auth-store";
import { hasCapability } from "@/features/admin/utils/roles";

export default function UsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const canUpdatePlan = hasCapability(currentUser?.role, "users.plan.update");
  const canUpdateStatus = hasCapability(currentUser?.role, "users.status.update");

  const { data, isLoading, error } = useUsers();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();
  const { mutate: updatePlan, isPending: isUpdatingPlan } = useUpdateUserPlan();

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6">Failed to load users</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-zinc-500">Platform users overview</p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Plan</th>
              <th className="p-4 text-left">Used</th>
              <th className="p-4 text-left">Limit</th>
              <th className="p-4 text-left">Remaining</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user: User) => (
              <tr key={user.id} className="border-b">
                <td className="p-4">{user.id}</td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  {canUpdatePlan ? (
                    <select
                      className="rounded-lg border px-3 py-2 text-sm"
                      value={user.plan_name ?? "free"}
                      disabled={isUpdatingPlan}
                      onChange={(e) => {
                        updatePlan({
                          userId: user.id,
                          planName: e.target.value,
                        });
                      }}
                    >
                      <option value="free">FREE TIER</option>
                      <option value="pro">PRO TIER</option>
                      <option value="enterprise">ENTERPRISE TIER</option>
                    </select>
                  ) : (
                    <span className="inline-block rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-600 uppercase">
                      {user.plan_name ?? "free"}
                    </span>
                  )}
                </td>
                <td className="p-4 font-medium">
                  {(user.total_tokens ?? 0).toLocaleString()}
                </td>
                <td className="p-4">
                  {(user.monthly_token_limit ?? 0).toLocaleString()}
                </td>
                <td className="p-4 font-medium text-green-600">
                  {(user.remaining_tokens ?? 0).toLocaleString()}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  {canUpdateStatus ? (
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() =>
                        updateStatus({
                          userId: user.id,
                          isActive: !user.is_active,
                        })
                      }
                      className={
                        user.is_active
                          ? "rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition cursor-pointer"
                          : "rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition cursor-pointer"
                      }
                    >
                      {user.is_active ? "Block" : "Unblock"}
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">
                      View only
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

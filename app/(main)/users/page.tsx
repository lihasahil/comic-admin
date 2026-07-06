"use client";

import { useState, useMemo } from "react";
import { useUsers, useDeleteUser, userKeys } from "@/hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";

import { RefreshCw, Users, Loader2, Trash2 } from "lucide-react";
import { UserRole } from "@/services/userService";
import UserFilter, { RoleFilter } from "./_components/user-filter";
import UserStats from "./_components/user-stats";
import UserTable from "./_components/user-table";
import { CreateAdminModal } from "./_components/create-admin-modal";

const LIMIT = 50;

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const queryClient = useQueryClient();

  const params = {
    limit: LIMIT,
    offset,
    ...(roleFilter !== "all" ? { role: roleFilter as UserRole } : {}),
    show_deleted: showDeleted,
  };

  const { data, isLoading, isError, isFetching, refetch } = useUsers(params);
  const {
    mutate: deleteUser,
    isPending: isDeleting,
    variables: deletingUserId,
  } = useDeleteUser();

  const allUsers = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return allUsers;
    const q = search.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.username?.toLowerCase().includes(q) ?? false),
    );
  }, [allUsers, search]);

  const handleRoleChange = (v: RoleFilter) => {
    setRoleFilter(v);
    setOffset(0);
  };

  const handleToggleShowDeleted = () => {
    setShowDeleted((prev) => !prev);
    setOffset(0);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  };

  const handleAdminCreated = () => {};

  return (
    <div className="min-h-screen text-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-michroma tracking-tight text-white">
              Users
            </h1>
            <p className="text-sm font-sf-pro text-zinc-500 mt-1">
              Manage all registered users
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="flex items-center justify-center font-michroma w-full md:w-xs bg-[#C3F001] text-[#171717] gap-2 rounded-lg px-5 py-2.5 text-[14px] transition-opacity hover:opacity-90 active:opacity-80"
            >
              <RefreshCw
                size={14}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
            {/* 3. Open modal on click */}
            <button
              onClick={() => setIsCreateAdminOpen(true)}
              className="flex items-center justify-center font-michroma w-full md:w-xs bg-[#C3F001] text-[#171717] gap-2 rounded-lg px-5 py-2.5 text-[14px] transition-opacity hover:opacity-90 active:opacity-80"
            >
              Create Admin Account
            </button>
          </div>
        </div>

        {/* Stats */}
        {data && <UserStats users={allUsers} total={total} />}

        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <UserFilter
            role={roleFilter}
            onRoleChange={handleRoleChange}
            search={search}
            onSearchChange={setSearch}
          />
          <button
            type="button"
            role="switch"
            aria-checked={showDeleted}
            onClick={handleToggleShowDeleted}
            className="flex items-center gap-2.5 group ml-[-8%] xl:ml-[-30%] 2xl:ml-[-40%]"
          >
            <Trash2
              size={14}
              className={showDeleted ? "text-red-400" : "text-zinc-500"}
            />
            <span
              className={`text-[14px] font-michroma transition-colors ${
                showDeleted
                  ? "text-red-400"
                  : "text-zinc-400 group-hover:text-white"
              }`}
            >
              Show Deleted
            </span>
            <span
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                showDeleted ? "bg-red-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                  showDeleted ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
          <div className="flex items-center gap-2">
            {search && (
              <span className="text-xs text-zinc-500">
                {filteredUsers.length} result
                {filteredUsers.length !== 1 ? "s" : ""}
              </span>
            )}
            {isFetching && !isLoading && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                <Loader2 size={11} className="animate-spin" />
                Updating…
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin text-zinc-600" />
            <p className="text-sm text-zinc-600">Loading users…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">Failed to load users.</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-amber-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">
              {showDeleted ? "No deleted users found." : "No users found."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-amber-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            onDelete={(id) => deleteUser(id)}
            deletingId={isDeleting ? (deletingUserId ?? null) : null}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && !search && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[#888888] font-sf-pro">
              Page {currentPage} of {totalPages} · {total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                className="px-3 py-1.5 rounded-lg text-xs font-michroma bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setOffset(offset + LIMIT)}
                className="px-3 py-1.5 rounded-lg text-xs bg-zinc-900 font-michroma border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateAdminModal
        open={isCreateAdminOpen}
        onClose={() => setIsCreateAdminOpen(false)}
        onSuccess={handleAdminCreated}
      />
    </div>
  );
}

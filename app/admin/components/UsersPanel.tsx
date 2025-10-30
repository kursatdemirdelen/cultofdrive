"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Calendar, Car, Eye } from "lucide-react";
import { UserDetailModal } from "./UserDetailModal";

type User = {
  id: string;
  email: string;
  created_at: string;
  car_count: number;
  listing_count: number;
};

type Props = {
  adminKey: string;
};

export function UsersPanel({ adminKey }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!adminKey) return;
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        headers: { "x-admin-key": adminKey },
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-white" />
          <h2 className="text-xl font-medium text-white">User Management</h2>
        </div>
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-white" />
          <h2 className="text-xl font-medium text-white">User Management</h2>
        </div>
        <span className="text-sm text-white/60">{users.length} users</span>
      </div>

      {users.length === 0 ? (
        <p className="text-center text-white/60 py-8">No users found</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-white/60" />
                  <span className="font-medium text-white truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    {user.car_count} cars
                  </span>
                  <span>•</span>
                  <span>{user.listing_count} listings</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUserId(user.id)}
                  className="rounded-lg border border-white/20 bg-white/5 p-2 text-white/80 transition hover:bg-white/10"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          adminKey={adminKey}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}

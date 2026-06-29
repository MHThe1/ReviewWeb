"use client";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

interface AdminUsersTabProps {
  users: AdminUser[];
  currentAdminEmail?: string;
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}

export default function AdminUsersTab({
  users,
  currentAdminEmail,
  onEditUser,
  onDeleteUser,
}: AdminUsersTabProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm animate-fade-in text-left">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-400 px-6 py-4">
              Name
            </th>
            <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-400 px-6 py-4">
              Email
            </th>
            <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-400 px-6 py-4">
              Role
            </th>
            <th className="text-right text-xs font-bold uppercase tracking-wider text-slate-400 px-6 py-4 pr-8">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm font-semibold">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/40 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">{u.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      u.is_admin
                        ? "bg-indigo-50 text-indigo-600 border-indigo-100/50"
                        : "bg-slate-50 text-slate-400 border-slate-200/30"
                    }`}
                  >
                    {u.is_admin ? "Admin" : "User"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right pr-8 shrink-0">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEditUser(u)}
                      className="text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    {currentAdminEmail !== u.email ? (
                      <button
                        onClick={() => onDeleteUser(u)}
                        className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-xl select-none cursor-not-allowed leading-relaxed inline-block">
                        Self
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

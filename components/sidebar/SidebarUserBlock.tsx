"use client";

import { getErrorMessage } from "@/lib/getErrorMessage";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

/* ── user header block used in Mobile ──────────────────────── */
export default function SidebarUserBlock() {
  const { user } = useSelector((s: any) => s.auth);
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser(undefined).unwrap();
    } catch (err) {
      // Clear the session locally even if the API call fails.
      toast.error(getErrorMessage(err));
    }
    // Hard navigation so middleware re-evaluates with the cleared cookie.
    window.location.assign("/register-login");
  };

  return (
    <div className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{user?.name}</div>
          <div className="text-xs text-neutral-400">{user?.email}</div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-neutral-900"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

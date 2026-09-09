import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { closeUserSidebar } from "@/redux/features/ui/sidebarSlice";
import React from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useDispatch } from "react-redux";

const LogoutButton: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    dispatch(closeUserSidebar());
    onLogout?.();
    try {
      await logoutUser(undefined).unwrap();
    } catch (err) {
      // Clear the session locally even if the API call fails.
      console.error("Logout failed:", err);
    }
    // Hard navigation so the browser re-runs middleware with the cleared
    // cookie — a soft router.push races the Set-Cookie and loops back in.
    window.location.assign("/register-login");
  };

  return (
    <div className="w-full px-2 ">
      <button
        className=" balance-info w-full rounded-lg flex items-center justify-center gap-2 text-[#ffc403] p-2 font-bold"
        onClick={handleLogout}
      >
        <span className="icon logout__icon" aria-hidden="true">
          <RiLogoutBoxRLine className="text-xl" />
        </span>
        Log out
      </button>
    </div>
  );
};

export default LogoutButton;

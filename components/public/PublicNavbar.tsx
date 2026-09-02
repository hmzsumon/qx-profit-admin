"use client";
import BrandLogo from "@/components/branding/BrandLogo";
import { toggleMobileSidebar } from "@/redux/features/ui/sidebarSlice";
import { AlignRight } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
const PublicNavbar = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <nav className="bg-[#00352f] border-b  border-b-[#075a51] w-full md:h-[80px] p-2">
        <div className="flex gap-2 items-center">
          <AlignRight
            className="text-white cursor-pointer"
            size={27}
            onClick={() => dispatch(toggleMobileSidebar())}
          />

          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">
              <BrandLogo size={30} href="/" />
            </div>
            <div className="flex space-x-2">
              <Link href="/login" className="">
                <span className="login_btn p-[.10rem] w-20">Login</span>
              </Link>
              <Link href="/register" className="">
                <span className="register-btn p-[.10rem] w-20">Register</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PublicNavbar;

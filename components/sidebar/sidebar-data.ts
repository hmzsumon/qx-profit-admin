// Central place to edit menu items
import type { LucideIcon } from "lucide-react";
import {
  Award,
  Bot,
  Clock4,
  Download,
  Grid2x2,
  LifeBuoy,
  Megaphone,
  MessageSquare,
  Settings,
  SquareGanttChart,
  TrendingUp,
  Upload,
  Users,
  Video,
  Wallet,
} from "lucide-react";

export type NavChild = { label: string; sublabel?: string; href: string };
export type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: "new" | number;
  children?: NavChild[];
  section?: "default" | "bottom";
};

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: Grid2x2, href: "/dashboard" },
  { key: "daily-video", label: "Daily Video", icon: Video, href: "/daily-video" },
  {
    key: "announcements",
    label: "Announcements",
    icon: Megaphone,
    href: "/announcements",
  },
  { key: "users", label: "All Users", icon: Users, href: "/users" },

  {
    key: "qx-broker",
    label: "QX Broker",
    icon: Bot,
    href: "/qx-trade",
  },

  {
    key: "deposits",
    label: "Deposits",
    icon: Download,

    children: [
      { label: "All Deposits", href: "/deposits/all" },
      {
        label: "Manual Deposits",
        href: "/deposits/manual",
      },
    ],
  },

  {
    key: "withdraw",
    label: "Withdrawals",
    icon: Upload,

    children: [
      { label: "All Withdrawals", href: "/withdrawals/all" },
      {
        label: "Pending Withdrawals",
        href: "/withdrawals/pending",
      },
    ],
  },
  {
    key: "trade-investment",
    label: "QX Investment",
    icon: TrendingUp,
    href: "/trade-investment",
    badge: "new",
  },
  {
    key: "rank-reward",
    label: "Rank Reward",
    icon: Award,
    href: "/rank-reward",
  },

  {
    key: "wallet",
    label: "Wallet",
    icon: Wallet,

    children: [
      { label: "P2P", href: "/wallet/p2p" },
      {
        label: "Internal Transfer",
        href: "/wallet/transfer",
      },
    ],
  },
  {
    key: "history",
    label: "Transaction history",
    icon: Clock4,
    href: "/dashboard/history",
  },

  {
    key: "settings",
    label: "Settings",
    icon: Settings,

    children: [
      { label: "Profile", href: "/settings/profile" },
      {
        label: "Security",
        href: "/settings/security",
      },
    ],
  },

  {
    key: "chat",
    label: "Live Chat",
    icon: MessageSquare,
    href: "/dashboard/chat",
    section: "bottom",
  },
  {
    key: "support",
    label: "Support",
    icon: LifeBuoy,
    href: "/dashboard/support",
  },
  { key: "kyc", label: "KYC Requests", icon: MessageSquare, href: "/kyc" },
];

export const INVITE_CARD = {
  title: "Invite friends and earn money",
  icon: SquareGanttChart,
  href: "/dashboard/referrals",
};

/* ── Navbar ─────────────────────────────────────────────────────────────────── */

import Link from "next/link";
import React from "react";
import CapitaliseLogo from "../branding/CapitaliseLogo";
import Container from "./Container";

const Navbar: React.FC = () => (
  <header className="sticky top-0 z-50 border-b border-neutral-900/60 bg-neutral-950/80 backdrop-blur">
    <Container className="flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <CapitaliseLogo
          variant="full"
          size={28}
          className="text-white"
          wordmarkClassName="text-white"
        />
        <span>Admin Penal</span>
      </Link>
    </Container>
  </header>
);

export default Navbar;

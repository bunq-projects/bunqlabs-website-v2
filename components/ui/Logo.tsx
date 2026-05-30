import Link from "next/link";
import LogoMark from "./LogoMark";

// Navbar logo: the reusable theme-aware mark, wrapped in a home link.
export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label="BUNQ Labs — home">
      <LogoMark className="logo-mark" />
    </Link>
  );
}

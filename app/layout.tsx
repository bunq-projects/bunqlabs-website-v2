import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import ThemeSync from "@/components/ThemeSync";
import AmbientAudio from "@/components/AmbientAudio";
import Loader from "@/components/Loader";
import Navbar from "@/components/ui/Navbar";
import ContactModal from "@/components/contact/ContactModal";
import Panel from "@/components/Panel";
import "./style-guide.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUNQ Labs — Immersive Creative Agency",
  description:
    "We design and build immersive, performant 3D web experiences.",
};

// Runs before first paint to set the theme, so there's no light/dark flash.
// Priority: saved choice → OS preference → light (site default). Tiny + dep-free.
// Rendered as the first node in <body> (not a manual <head>) so it's part of
// React's tree identically on server + client — it can't cause a hydration
// mismatch — while still executing before any page content paints.
const themeInitScript = `
(function(){try{
  var t=localStorage.getItem('theme');
  if(t!=='light'&&t!=='dark'){
    t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  }
  document.documentElement.dataset.theme=t;
}catch(e){document.documentElement.dataset.theme='light';}})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning on <html>/<body> absorbs the pre-paint
    // data-theme attribute and any attributes browser extensions inject.
    <html
      lang="en"
      className={GeistMono.variable}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeSync />
        <AmbientAudio />
        <Navbar />
        {children}
        <ContactModal />
        <Panel />
        <Loader />
      </body>
    </html>
  );
}

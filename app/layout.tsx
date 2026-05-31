import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import ThemeSync from "@/components/ThemeSync";
import AmbientAudio from "@/components/AmbientAudio";
import Loader from "@/components/Loader";
import Navbar from "@/components/ui/Navbar";
import ContactModal from "@/components/contact/ContactModal";
import Panel from "@/components/Panel";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import CustomCursor from "@/components/CustomCursor";
import ScrambleCursor from "@/components/ScrambleCursor";
import PageFrame from "@/components/PageFrame";
import GridOverlay from "@/components/GridOverlay";
import "./style-guide.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUNQ Labs — Immersive Creative Agency",
  description:
    "We design and build immersive, performant 3D web experiences.",
};

// Runs before first paint to set the theme's two base colors, so there's no
// light/dark flash. Priority: saved base → OS preference → light. The derived
// tokens in style-guide.css compute from these. Rendered as the first <body>
// node (not a manual <head>) so it's identical on server + client (no hydration
// mismatch) while still executing before any page content paints.
const themeInitScript = `
(function(){try{
  var t=localStorage.getItem('theme');
  if(t!=='light'&&t!=='dark'){
    t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  }
  var s=document.documentElement.style, dark=t==='dark';
  s.setProperty('--primary', dark?'#000000':'#ffffff');
  s.setProperty('--secondary', dark?'#ffffff':'#000000');
}catch(e){}})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning on <html>/<body> absorbs the pre-paint inline
    // --primary/--secondary styles and any attributes browser extensions inject.
    <html
      lang="en"
      className={GeistMono.variable}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeSync />
        <AmbientAudio />
        <GridOverlay />
        <Navbar />
        {children}
        <ContactModal />
        <Panel />
        <ThemeSwitcher />
        <CustomCursor />
        <ScrambleCursor />
        <Loader />
        <PageFrame />
      </body>
    </html>
  );
}

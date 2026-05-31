import Logo from "./Logo";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";
import ContactButton from "./ContactButton";
import NavPanelButton from "./NavPanelButton";
import WorkNavButton from "./WorkNavButton";

// Three-column grid so the center group (work · logo · about) stays optically
// centered regardless of how wide the left/right groups get.
//
//   [ sound: on ]      [ work · LOGO · about ]      [ theme · CONTACT ]
//
export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner" aria-label="Primary">
        <div className="nav-left">
          <SoundToggle />
        </div>

        <div className="nav-center">
          <WorkNavButton>Work</WorkNavButton>
          <Logo />
          <NavPanelButton id="about">About</NavPanelButton>
        </div>

        <div className="nav-right">
          <ThemeToggle />
          <ContactButton />
        </div>
      </nav>
    </header>
  );
}

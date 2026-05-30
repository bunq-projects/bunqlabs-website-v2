import Logo from "./Logo";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";
import ContactButton from "./ContactButton";
import NavPanelButton from "./NavPanelButton";

// Three-column grid so the center group (about · logo · work) stays optically
// centered regardless of how wide the left/right groups get.
//
//   [ sound ]        [ about · LOGO · work ]        [ theme · contact ]
//
export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner" aria-label="Primary">
        <div className="nav-left">
          <SoundToggle />
        </div>

        <div className="nav-center">
          <NavPanelButton id="about">About</NavPanelButton>
          <Logo />
          <NavPanelButton id="work">Work</NavPanelButton>
        </div>

        <div className="nav-right">
          <ThemeToggle />
          <ContactButton />
        </div>
      </nav>
    </header>
  );
}

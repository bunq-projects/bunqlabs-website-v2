// Static viewport frame: 4 equal-width edge bars + 4 rounded inner corners,
// built from real elements (styled in globals.css) — no box-shadow. Purely
// presentational; the color follows the theme's secondary.
export default function PageFrame() {
  return (
    <div className="page-frame" aria-hidden="true">
      <span className="pf-top" />
      <span className="pf-bottom" />
      <span className="pf-left" />
      <span className="pf-right" />
      <span className="pf-corner pf-tl" />
      <span className="pf-corner pf-tr" />
      <span className="pf-corner pf-bl" />
      <span className="pf-corner pf-br" />
    </div>
  );
}

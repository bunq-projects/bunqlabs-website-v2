// Faint 12-column grid guide. Each column is outlined on both edges with a
// gutter (column-gap) between columns — so every gutter shows two lines. Styled
// in globals.css; sits at the very back, behind the transparent canvas.
export default function GridOverlay() {
  return (
    <div className="grid-overlay" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className="grid-column" />
      ))}
    </div>
  );
}

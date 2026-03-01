/**
 * ProtectedImage — Drop-in <img> replacement that prevents casual downloading.
 *
 * Protections:
 * 1. Transparent overlay div blocks right-click "Save Image As"
 * 2. onContextMenu disabled (right-click shows nothing)
 * 3. onDragStart disabled (can't drag image to desktop)
 * 4. CSS user-select: none and pointer-events: none on the <img>
 * 5. Image wrapped so the <img> src isn't the direct click target
 */
export default function ProtectedImage({ src, alt, className, imgClassName, onClick, ...rest }) {
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div
      className={`relative overflow-hidden ${className || ''}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onClick={onClick}
      {...rest}
    >
      {/* Actual image — pointer-events disabled so right-click targets the overlay */}
      <img
        src={src}
        alt={alt || ''}
        className={`${imgClassName || ''} select-none`}
        draggable={false}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{ WebkitUserDrag: 'none', pointerEvents: 'none' }}
        loading="lazy"
      />
      {/* Transparent overlay — blocks "Save Image As" on right-click */}
      <div className="absolute inset-0 z-[1]" aria-hidden="true" />
    </div>
  );
}

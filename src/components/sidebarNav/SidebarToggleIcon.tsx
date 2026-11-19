/**
 * `menu-sidebar-collapse.svg` without its small interior arrow: one icon for
 * both directions, with the tooltip saying which. Drawn in `currentColor` so
 * hover can retone it.
 */
export const SidebarToggleIcon = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path
      opacity={0.2}
      d="M3.75 19.5a.75.75 0 0 1-.75-.75V5.25a.75.75 0 0 1 .75-.75h4.5v15h-4.5Z"
      fill="currentColor"
      stroke="none"
    />
    <path d="M8.25 4.5v15" strokeWidth={1.5} />
    <path
      d="M20.25 4.5H3.75a.75.75 0 0 0-.75.75v13.5c0 .41.34.75.75.75h16.5c.41 0 .75-.34.75-.75V5.25a.75.75 0 0 0-.75-.75Z"
      strokeWidth={1.5}
    />
    <path d="M3 7.5h2.25M3 10.5h2.25M3 13.5h2.25" strokeWidth={1.5} />
  </svg>
)

// Brand mark: four toe beans over a mint-leaf pad.
export default function Mark({ className, fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill={fill} aria-hidden="true">
      <circle cx="6.5" cy="11.5" r="3" />
      <circle cx="12" cy="6.5" r="3" />
      <circle cx="20" cy="6.5" r="3" />
      <circle cx="25.5" cy="11.5" r="3" />
      <path d="M16 12.5c7.5 3 9.5 10.5 0 17-9.5-6.5-7.5-14 0-17Z" />
    </svg>
  );
}

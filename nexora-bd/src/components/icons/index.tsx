import type { SVGProps } from 'react';
import type { CategorySlug } from '@/types';

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function makeIcon(paths: string[]) {
  return function Icon({ className, ...rest }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
        {...rest}
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  };
}

export const SearchIcon = makeIcon(['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z', 'M20 20l-4.3-4.3']);
export const CartIcon = makeIcon([
  'M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2',
  'M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  'M17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
]);
export const HeartIcon = makeIcon(['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z']);
export const UserIcon = makeIcon(['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4 21c0-4 3.6-6 8-6s8 2 8 6']);
export const MenuIcon = makeIcon(['M4 7h16', 'M4 12h16', 'M4 17h16']);
export const CloseIcon = makeIcon(['M6 6l12 12', 'M18 6L6 18']);
export const ChevronDownIcon = makeIcon(['M6 9l6 6 6-6']);
export const ChevronLeftIcon = makeIcon(['M15 18l-6-6 6-6']);
export const ChevronRightIcon = makeIcon(['M9 18l6-6-6-6']);
export const CheckIcon = makeIcon(['M5 12.5l4.5 4.5L19 7.5']);
export const TruckIcon = makeIcon([
  'M3 6h11v10H3z',
  'M14 10h4l3 3v3h-7',
  'M7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  'M17 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
]);
export const ShieldIcon = makeIcon(['M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z', 'M9 12l2 2 4-4']);
export const ReturnIcon = makeIcon(['M9 14L4 9l5-5', 'M4 9h10a6 6 0 0 1 0 12h-3']);
export const TrashIcon = makeIcon(['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13']);
export const MinusIcon = makeIcon(['M5 12h14']);
export const PlusIcon = makeIcon(['M12 5v14', 'M5 12h14']);
export const InfoIcon = makeIcon(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 11v5', 'M12 8h.01']);
export const AlertIcon = makeIcon(['M12 4l9 16H3L12 4Z', 'M12 10v4', 'M12 17h.01']);
export const XCircleIcon = makeIcon(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M9 9l6 6', 'M15 9l-6 6']);
export const StarIcon = makeIcon([
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z',
]);
export const GridIcon = makeIcon(['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z']);
export const ListIcon = makeIcon(['M8 6h12', 'M8 12h12', 'M8 18h12', 'M4 6h.01', 'M4 12h.01', 'M4 18h.01']);
export const PhoneIcon = makeIcon([
  'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z',
]);
export const MailIcon = makeIcon(['M3 6h18v12H3z', 'M3 7l9 6 9-6']);
export const BoltIcon = makeIcon(['M13 2L4 14h7l-1 8 9-12h-7l1-8Z']);
export const ArrowRightIcon = makeIcon(['M5 12h14', 'M13 6l6 6-6 6']);

export const FacebookIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.4V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8.1v3h2.4v7h3Z" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" focusable="false" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);

export const YoutubeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);

export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" {...props}>
      <rect width="40" height="40" rx="11" fill="#D81B60" />
      <path d="M11 15h18l-1.6 13.2a2 2 0 0 1-2 1.8H14.6a2 2 0 0 1-2-1.8L11 15Z" fill="#F2A93B" />
      <path d="M15.5 15v-1.5a4.5 4.5 0 0 1 9 0V15" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ✅ FIX: Notun Electronic Category gulor jonno Icon Paths Update Kora Holo
const categoryIconPaths: Record<CategorySlug, string[]> = {
  mobile: ['M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', 'M11 18h2'],
  laptops: ['M4 5h16v10H4z', 'M2 19h20', 'M9 15v4h6v-4'],
  tv: ['M3 5h18v11H3z', 'M9 20h6', 'M12 16v4'],
  audio: ['M4 15v-3a8 8 0 0 1 16 0v3', 'M4 15a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-6H4Z', 'M20 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2v-6h2Z'],
  cameras: ['M4 7h4l2-3h4l2 3h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  gaming: ['M6 12h4', 'M8 10v4', 'M15 13h.01', 'M18 11h.01', 'M7 8h10a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4c-1.5 0-2.5-1-3-2H10c-.5 1-1.5 2-3 2a4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4Z'],
  'smart-watches': ['M9 3h6v4H9z', 'M9 17h6v4H9z', 'M7 7h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z', 'M12 10v2l1 1'],
  'home-appliances': ['M5 3h14v18H5z', 'M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M5 8h14'],
  'computer-parts': ['M7 7h10v10H7z', 'M3 4h4v4H3z', 'M17 4h4v4h-4z', 'M3 16h4v4H3z', 'M17 16h4v4h-4z', 'M9 3v2', 'M15 3v2', 'M9 19v2', 'M15 19v2'],
  accessories: ['M7 11h10v2H7z', 'M9 11V8a3 3 0 0 1 6 0v3', 'M6 13h12v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5Z'],
};

export function CategoryIcon({ slug, ...rest }: IconProps & { slug: CategorySlug }) {
  // Fallback safety jodi kono slug miss hoy
  const paths = categoryIconPaths[slug] || categoryIconPaths['mobile']; 
  
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}


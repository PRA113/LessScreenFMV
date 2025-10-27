/**
 * LessScreen Logo Component
 * 
 * Importiert das Logo als Figma Asset, das beim Build automatisch
 * als statisches Asset verarbeitet wird.
 */

import logoImage from 'figma:asset/2f1ee823d60cadaee7aa808915269a608e632061.png';

interface LogoProps {
  className?: string;
  alt?: string;
}

export function Logo({ className = '', alt = 'LessScreen Logo' }: LogoProps) {
  return (
    <img 
      src={logoImage} 
      alt={alt}
      className={className}
    />
  );
}

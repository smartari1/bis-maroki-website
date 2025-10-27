import { ReactNode } from 'react';

interface ContactCardProps {
  icon: ReactNode;
  title: string;
  content: string | ReactNode;
  href?: string;
}

/**
 * Contact information card with icon, title, and content
 * Optional link for clickable cards (phone, WhatsApp)
 */
export default function ContactCard({ icon, title, content, href }: ContactCardProps) {
  const cardContent = (
    <>
      <div className="text-brand-brown mb-2">{icon}</div>
      <h3 className="font-semibold text-brand-black mb-1">{title}</h3>
      <div className="text-text-gray">{content}</div>
    </>
  );

  const baseClasses = 'bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300';

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} block`}
        data-interactive
      >
        {cardContent}
      </a>
    );
  }

  return <div className={baseClasses}>{cardContent}</div>;
}

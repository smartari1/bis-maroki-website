'use client';

import { useEffect } from 'react';

/**
 * CSS-only Custom Cursor Component
 * Pure CSS implementation using custom properties for mouse tracking
 * Mobile: hidden (native cursor)
 * Desktop: custom plate cursor with hover states
 */
export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.setProperty('--mouse-x', `${e.clientX}px`);
      cursor.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    const addHoverState = () => {
      cursor.classList.add('cursor-hover');
    };

    const removeHoverState = () => {
      cursor.classList.remove('cursor-hover');
    };

    const addActiveState = () => {
      cursor.classList.add('cursor-active');
    };

    const removeActiveState = () => {
      cursor.classList.remove('cursor-active');
    };

    // Mouse movement
    document.addEventListener('mousemove', moveCursor);

    // Hover states for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-interactive]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', addHoverState);
      el.addEventListener('mouseleave', removeHoverState);
      el.addEventListener('mousedown', addActiveState);
      el.addEventListener('mouseup', removeActiveState);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', addHoverState);
        el.removeEventListener('mouseleave', removeHoverState);
        el.removeEventListener('mousedown', addActiveState);
        el.removeEventListener('mouseup', removeActiveState);
      });
    };
  }, []);

  return (
    <>
      <div
        id="custom-cursor"
        className="custom-cursor hidden md:block"
        aria-hidden="true"
      >
        {/* Custom cursor image */}
        <img
          src="https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/mause.png"
          alt=""
          className="cursor-image"
        />
      </div>

      <style jsx global>{`
        .custom-cursor {
          position: fixed;
          width: 100px;
          height: 100px;
          pointer-events: none;
          z-index: 9999;
          left: var(--mouse-x);
          top: var(--mouse-y);
          transform: translate(-50%, -50%);
          transition: transform 0.15s ease-out;
          animation: cursor-float 3s ease-in-out infinite;
        }

        .cursor-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .custom-cursor.cursor-hover {
          transform: translate(-50%, -50%) scale(1.3);
          animation: none;
        }

        .custom-cursor.cursor-active {
          transform: translate(-50%, -50%) scale(0.9);
        }

        @keyframes cursor-float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-3px);
          }
        }

        /* Hide native cursor on desktop */
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}

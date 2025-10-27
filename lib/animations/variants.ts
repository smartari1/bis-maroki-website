import { Variants } from 'framer-motion';

/**
 * Reusable Framer Motion animation variants for the ביס מרוקאי website
 * All animations respect RTL layout and brand design system
 */

// Fade in from bottom with slide
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for smooth motion
    }
  }
};

// Fade in from right (RTL entrance direction)
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30  // RTL: Enter from right
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Scale entrance with fade
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

// Container for staggered children animations
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Carousel slide transitions (for testimonials)
export const slideCarousel: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,  // RTL aware
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,  // RTL aware
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  })
};

// Scale bounce for hover interactions
export const scaleBounce: Variants = {
  rest: {
    scale: 1
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

// Rotate + fade for section headings
export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotate: -5,
    y: 20
  },
  visible: {
    opacity: 1,
    rotate: 0,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Card lift effect on hover
export const cardLift: Variants = {
  rest: {
    y: 0,
    boxShadow: 'var(--shadow-md)'
  },
  hover: {
    y: -8,
    boxShadow: 'var(--shadow-lg)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Pulse animation for CTAs
export const pulse: Variants = {
  rest: {
    scale: 1
  },
  pulse: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Image zoom on parent hover
export const imageZoom: Variants = {
  rest: {
    scale: 1
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

// Sequential star fill animation
export const starFill: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
      ease: 'easeInOut'
    }
  })
};

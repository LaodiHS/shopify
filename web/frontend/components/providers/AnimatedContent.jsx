import React, { useEffect } from 'react';
import { animate} from 'popmotion';
import styler from 'stylefire';
import { useInView } from 'react-intersection-observer';

function AnimatedContent({ children, animationConfig }) {
  const contentRef = useRef(null);
  const [inViewRef, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView && animationConfig) {
      const { direction, duration, startX, endX } = animationConfig;
      const element = contentRef.current;
      const xStyler = styler(element);

      animate({
        from: direction === 'in' ? startX : endX,
        to: direction === 'in' ? endX : startX,
        duration: duration || 500,
        onUpdate: (x) => {
          xStyler.set('x', x);
        },
      });
    }
  }, [inView, animationConfig]);

  return (
    <div
      ref={(node) => {
        contentRef.current = node;
        inViewRef(node);
      }}
      style={{
        position: 'relative',
        top: 0,
        left: 0,
      }}
    >
      {children}
    </div>
  );
}

export {AnimatedContent};


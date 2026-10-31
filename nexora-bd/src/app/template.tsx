'use client';

import { motion, MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
        {children}
      </motion.div>
    </MotionConfig>
  );
}

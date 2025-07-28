'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormTheme, getDefaultTheme } from '@/lib/constants/themes';

export type TabItem = {
  id: string | number;
  name: string;
  content: string | ReactNode;
};

export interface TabsProps {
  items?: TabItem[];
  className?: string;
  theme?: FormTheme;
}

export default function Tabs({ items = [], className = '', theme }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string | number>(items[0]?.id ?? 1);
  
  // Use provided theme or default theme
  const currentTheme = theme || getDefaultTheme();

  // Debug log to verify theme is working
  console.log('Tabs component using theme:', currentTheme.name, currentTheme.colors.primary);

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const indicatorVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={tabVariants}
      className={`backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl ${className}`}
      style={{
        backgroundColor: `${currentTheme.colors.surface}CC`,
        border: `1px solid ${currentTheme.colors.border}80`,
        borderRadius: currentTheme.borderRadius,
        boxShadow: currentTheme.shadow !== 'none' ? currentTheme.shadow : undefined
      }}
    >
      {/* Tabs Header */}
      <div 
        className='flex backdrop-blur-sm'
        style={{
          borderBottom: `1px solid ${currentTheme.colors.border}80`,
          backgroundColor: `${currentTheme.colors.background}80`
        }}
      >
        {items.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-4 text-sm font-medium transition-all duration-300 ease-out`}
            style={{
              color: activeTab === tab.id 
                ? currentTheme.colors.text 
                : currentTheme.colors.textSecondary
            }}
            whileHover={{ 
              scale: 1.02,
              color: currentTheme.colors.text
            }}
            whileTap={{ scale: 0.98 }}
            aria-selected={activeTab === tab.id}
            role='tab'
          >
            <span className='relative z-10'>{tab.name}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className='absolute bottom-0 left-0 right-0 h-0.5'
                style={{
                  background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                }}
                initial="hidden"
                animate="visible"
                variants={indicatorVariants}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content Area */}
      <div className='relative overflow-hidden'>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            role='tabpanel'
            className='p-8 backdrop-blur-sm'
            style={{
              backgroundColor: `${currentTheme.colors.surface}CC`,
              color: currentTheme.colors.text
            }}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {items.find((tab) => tab.id === activeTab)?.content || items[0]?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

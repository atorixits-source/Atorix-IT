import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpandableCard({ title, icon: Icon, children, isOpen: isOpenProp, onToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  const isExpanded = onToggle ? isOpenProp : isOpen;

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800">
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center">
          {Icon && <Icon className="mr-4 h-6 w-6 text-blue-600 dark:text-blue-400" />}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500 dark:text-gray-400"
        >
          ▼
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 text-gray-600 dark:text-gray-300">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

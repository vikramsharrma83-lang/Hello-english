import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useVelocity, useSpring } from 'motion/react';

interface PickerProps {
  options: string[];
  onSelect: (option: string) => void;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

export const RolePicker: React.FC<PickerProps> = ({ options, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const y = useMotionValue(0);
  const smoothY = useSpring(y, { stiffness: 400, damping: 40 });

  const handleDragEnd = (_: any, info: any) => {
    const snapToIndex = Math.round(-info.offset.y / ITEM_HEIGHT);
    const index = Math.max(0, Math.min(options.length - 1, snapToIndex));
    setSelectedIndex(index);
    y.set(-index * ITEM_HEIGHT);
    onSelect(options[index]);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black z-50 absolute inset-0">
      <h2 className="text-white text-3xl font-bold mb-16">Select your industry</h2>
      
      <div className="relative w-full h-[250px] overflow-hidden flex justify-center items-center">
        {/* Highlight center row */}
        <div className="absolute w-full h-[50px] bg-white/5 rounded-xl border border-white/10" />

        <motion.div
          drag="y"
          dragConstraints={{ top: -(options.length - 1) * ITEM_HEIGHT, bottom: 0 }}
          style={{ y: smoothY }}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing w-full"
        >
          {options.map((option, index) => {
            const opacity = useTransform(y, [-(index - 2) * ITEM_HEIGHT, -index * ITEM_HEIGHT, -(index + 2) * ITEM_HEIGHT], [0.3, 1, 0.3]);
            const scale = useTransform(y, [-(index - 2) * ITEM_HEIGHT, -index * ITEM_HEIGHT, -(index + 2) * ITEM_HEIGHT], [0.8, 1, 0.8]);
            const rotateX = useTransform(y, [-(index - 2) * ITEM_HEIGHT, -index * ITEM_HEIGHT, -(index + 2) * ITEM_HEIGHT], [30, 0, -30]);

            return (
              <motion.div
                key={option}
                style={{ opacity, scale, rotateX, height: ITEM_HEIGHT }}
                className={`flex items-center justify-center text-2xl ${index === selectedIndex ? 'text-white font-bold' : 'text-gray-600 font-normal'}`}
              >
                {option}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      <button 
        onClick={() => onSelect(options[selectedIndex])}
        className="mt-16 w-full max-w-[200px] py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-colors shadow-lg"
      >
        Continue
      </button>
    </div>
  );
};

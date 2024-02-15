import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypingAnimationProps {
    text: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text }) => {
    const [index, setIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const typingSpeed = 150; // 타이핑 속도(ms)

    useEffect(() => {
        if (index < text.length) {
            setTimeout(() => {
                setCurrentText((prev) => prev + text.charAt(index));
                setIndex((prev) => prev + 1);
            }, typingSpeed);
        } else {
            setTimeout(() => {
                setCurrentText('');
                setIndex(0);
            }, 2000); // 타이핑이 끝난 후 2초 대기하고 다시 시작
        }
    }, [index, text]);

    return (
        <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        >
            {currentText}
        </motion.span>
    );
};

const Header: React.FC = () => {
    return (
        <nav className="flex justify-between items-center pt-5 px-10">
            <div className='absolute flex gap-1 mr-5 right'>
                <span className="w-3 h-3 inline-block bg-red-500 rounded-xl mr-2"></span>
                <span className="w-3 h-3 inline-block bg-yellow-400 rounded-xl mr-2"></span>
                <span className="w-3 h-3 inline-block bg-green-400 rounded-xl"></span>
            </div>
            <div className="flex items-center mx-auto gap-3 max-w-2xl w-full px-5 p-2 bg-white rounded-lg shadow-lg">
                <span>⭐</span>
                <TypingAnimation text="오늘 기분 어때?" />
            </div>
        </nav>
    );
};

export default Header;

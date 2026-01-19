import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AstrologyData from './data/SAPAstrology.json';

interface Option {
    id: string;
    label: string;
    description: string;
}

interface Question {
    id: string;
    title: string;
    subtitle: string;
    options: Option[];
}

interface Props {
    onFinish: (win: boolean) => void;
}

/* ---------- Geometry Helpers ---------- */

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
};

const describeArc = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';

    return `
    M ${cx} ${cy}
    L ${start.x} ${start.y}
    A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}
    Z
  `;
};

/* ---------- UI Constants ---------- */

const SLICE_GRADIENTS = [
    ['#FFD166', '#FCA311'],
    ['#6AA9FF', '#3A86FF'],
    ['#B983FF', '#8E6CFF'],
    ['#F78FB3', '#E84393'],
    ['#63E6BE', '#12B886'],
];

export const SAPAstrology: React.FC<Props> = ({ onFinish }) => {
    const question: Question = useMemo(() => {
        const list = AstrologyData.questions;
        return list[Math.floor(Math.random() * list.length)];
    }, []);

    const sliceAngle = 360 / question.options.length;

    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [resultIndex, setResultIndex] = useState<number | null>(null);

    const lastTickRef = useRef(0);
    const tickAudio = useRef(new Audio('/sounds/wheel-spin.mp3')); // your tick sound

    /* ---------- Spin Logic ---------- */

    const triggerSpin = (force = 1) => {
        if (spinning) return;

        setSpinning(true);
        setResultIndex(null);

        const selectedIndex = Math.floor(Math.random() * question.options.length);
        const baseRotation =
            360 * (4 + Math.random() * 2) * force +
            (360 - (selectedIndex * sliceAngle + sliceAngle / 2));

        setRotation(prev => prev + baseRotation);

        // Start tick sound
        tickAudio.current.currentTime = 0;
        tickAudio.current.play();
        // tickAudio.current.loop = true;

        // Stop tick sound after 4000 ms
        const spinDuration = 2000;
        const postSpinDelay = 2000; // 1 second delay
        setTimeout(() => {
            tickAudio.current.pause();
        }, 4000); // <-- hard-coded tick duration

        // Finish spin
        setTimeout(() => {
            setResultIndex(selectedIndex); // show popup
            setSpinning(false);
        }, spinDuration + postSpinDelay);
    };

    /* ---------- Tick Sound on Slice (Optional) ---------- */

    const handleUpdate = (latest: { rotate: number }) => {
        const normalizedRotation = latest.rotate % 360;
        const currentSlice = Math.floor(normalizedRotation / sliceAngle);

        if (currentSlice !== lastTickRef.current) {
            // This can stay if you want extra tick per slice
            // Or you can comment it out since we now have continuous 4000ms tick
            // tickAudio.current.currentTime = 0;
            // tickAudio.current.play();
            lastTickRef.current = currentSlice;
        }
    };

    const closeResult = () => {
        setResultIndex(null);
        onFinish(true);
    };

    return (
        <div className="w-full flex flex-col items-center space-y-6">
            <p className="text-sm italic text-gray-500 text-center">{question.subtitle}</p>

            <h2 className="text-lg font-bold text-center text-gray-800">{question.title}</h2>

            {/* Wheel */}
            <div className="relative w-80 h-80 overflow-visible">
                {/* Pointer */}
                <svg
                    width="28"
                    height="40"
                    viewBox="0 0 28 40"
                    className="absolute left-1/2 -translate-x-1/2 -top-5 z-30"
                >
                    <path d="M14 0 L26 26 L14 20 L2 26 Z" fill="#111827" />
                </svg>

                <motion.svg
                    viewBox="0 0 300 300"
                    className="rounded-full origin-center cursor-grab active:cursor-grabbing"
                    style={{ transformOrigin: '50% 50%' }}
                    animate={{ rotate: rotation }}
                    transition={{ duration: 4.5, ease: 'easeOut' }}
                    onUpdate={handleUpdate}
                    drag
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                        const velocity = Math.abs(info.velocity.x + info.velocity.y);
                        triggerSpin(Math.min(velocity / 1000, 2));
                    }}
                >
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {question.options.map((_, i) => {
                            const [from, to] = SLICE_GRADIENTS[i % SLICE_GRADIENTS.length];
                            return (
                                <linearGradient key={i} id={`grad-${i}`} gradientTransform="rotate(45)">
                                    <stop offset="0%" stopColor={from} />
                                    <stop offset="100%" stopColor={to} />
                                </linearGradient>
                            );
                        })}
                    </defs>

                    {question.options.map((opt, i) => {
                        const start = i * sliceAngle;
                        const end = start + sliceAngle;
                        const mid = start + sliceAngle / 2;
                        const textPos = polarToCartesian(150, 150, 92, mid);
                        const isWinner = resultIndex === i;

                        return (
                            <g key={opt.id}>
                                <path
                                    d={describeArc(150, 150, 135, start, end)}
                                    fill={`url(#grad-${i})`}
                                    stroke={isWinner ? '#FFD700' : 'white'}
                                    strokeWidth={isWinner ? 5 : 2}
                                    filter={isWinner ? 'url(#glow)' : undefined}
                                />
                                <text
                                    x={textPos.x}
                                    y={textPos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    transform={`rotate(${mid} ${textPos.x} ${textPos.y})`}
                                    className="text-[12px] font-bold fill-white drop-shadow-sm select-none"
                                >
                                    {opt.label}
                                </text>
                            </g>
                        );
                    })}

                    <circle cx="150" cy="150" r="28" fill="#111827" stroke="white" strokeWidth="4" />
                </motion.svg>
            </div>

            <button
                onClick={() => triggerSpin(1)}
                disabled={spinning}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50"
            >
                Spin the Wheel
            </button>

            {/* Result Popup */}
            {resultIndex !== null && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm text-center space-y-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-800">
                            {question.options[resultIndex].label}
                        </h3>
                        <p className="text-gray-600 text-sm">{question.options[resultIndex].description}</p>
                        <button
                            onClick={closeResult}
                            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:scale-105 transition"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

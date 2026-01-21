import React from "react";
import { UserProgress } from "../types";

interface Props {
    user: UserProgress;
    onLogout: () => void;
}

export const FinalBadge: React.FC<Props> = ({ user, onLogout }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#00152f] p-6">
            <div className="relative aspect-[3/4] w-full max-w-sm 
        flex flex-col justify-between items-center
        rounded-2xl border-4 border-[#c5a059] 
        shadow-2xl overflow-hidden bg-[#1e3a5f] p-8">

                {/* leather texture overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />
                <div className="absolute top-3 right-3 z-20 flex items-center gap-3">
                    <img
                        src="/assets/sopra-steria-logo-white.png"
                        alt="Sopra Steria Logo"
                        className="w-24 h-auto object-contain opacity-90 drop-shadow-md"
                    />

                    <button
                        onClick={onLogout}
                        className="text-[#c5a059] hover:text-amber-700 transition-colors"
                        title="Logout"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-6 h-6 stroke-[#c5a059]"
                            fill="none"
                            strokeWidth={1.8}
                        >
                            <path d="M3 12a9 9 0 1 1 9 9" />
                            <path d="M3 12l-2 2m2-2l2 2" />
                        </svg>
                    </button>
                </div>



                {/* title section */}
                <div className="text-center z-10 mt-2">
                    <div className="text-[#c5a059] border-2 border-[#c5a059] px-3 py-1 inline-block rounded mb-3">
                        <h2 className="text-sm font-bold tracking-[0.25em] uppercase">SAP experience zone</h2>
                    </div>

                    <h1 className="text-3xl font-extrabold text-[#c5a059] tracking-widest uppercase">
                        Congrats!!
                    </h1>

                    <div className="h-1 bg-[#c5a059] w-full mt-3" />
                </div>

                {/* emblem */}
                <div className="z-10 w-28 h-28 border-4 border-[#c5a059] rounded-full flex items-center justify-center">
                    <span className="text-6xl opacity-90">🏅</span>
                </div>

                <p className="text-[#c5a059] text-sm uppercase tracking-widest opacity-60">
                    SAP Voyager Program
                </p>

                <p className="text-[#c5a059] text-2xl md:text-xl font-extrabold uppercase tracking-widest text-center mt-2">
                    {`Well Done ${user.name.toUpperCase()}!`}
                </p>
                <p className="text-[#c5a059]/80 text-[10px] md:text-xs tracking-wider text-center">
                    You completed all activities 😊
                </p>
                <p className="text-[#c5a059]/80 text-[10px] md:text-xs tracking-wider text-center">
                    Check your email 📧
                </p>
                <div className="z-10 text-center w-full mb-1">

                    <div className="text-sm text-[#c5a059] opacity-70 break-all">
                        Sopra Steria India Management kick off 2026
                    </div>
                </div>
            </div>
        </div>
    );
};

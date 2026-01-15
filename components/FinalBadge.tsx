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
                <button
                    onClick={onLogout}
                    className="absolute top-3 right-3 text-[#c5a059] hover:text-amber-700 transition-colors"
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

                <p className="text-[#c5a059] text-[10px] uppercase tracking-widest opacity-60">
                    SAP Voyager Program
                </p>

                <p className="text-[#c5a059] text-2xl md:text-xl font-extrabold uppercase tracking-widest text-center mt-2">
                    {`Well Done ${user.name.toUpperCase()}!`}
                </p>
                <p className="text-[#c5a059]/80 text-[10px] md:text-xs tracking-wider text-center">
                    You completed all activities 😊
                </p>


                {/* login form */}
                {/* <form onSubmit={handleSubmit} className="z-10 w-full space-y-4">
                    <input
                        type="user"
                        value={user}
                        onChange={(e) => {
                            setUser(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter Name"
                        className="w-full text-center text-xl py-3 
              bg-transparent text-[#c5a059]
              border-2 border-[#c5a059] rounded-xl
              placeholder:text-[#c5a059]/40
              focus:outline-none"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        placeholder="name@example.com"
                        className="w-full text-center text-xl py-3 
              bg-transparent text-[#c5a059]
              border-2 border-[#c5a059] rounded-xl
              placeholder:text-[#c5a059]/40
              focus:outline-none"
                    />

                    {error && (
                        <p className="text-red-300 text-xs text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#c5a059] text-[#1e3a5f] py-3 rounded-xl 
              font-bold text-lg shadow-lg active:scale-95 transition-all"
                    >
                        Onboard
                    </button>
                </form> */}

                {/* footer */}
                <div className="z-10 text-center w-full mb-1">

                    <div className="text-sm text-[#c5a059] opacity-70 break-all">
                        Sopra Steria India Management kick off 2026
                    </div>
                </div>
            </div>
        </div>
        // <div className="min-h-screen flex items-center justify-center bg-[#00152f] p-6 relative">
        //   <div className="relative aspect-[3/4] w-full max-w-sm 
        //     flex flex-col justify-between items-center
        //     rounded-2xl border-4 border-[#c5a059] 
        //     shadow-2xl overflow-hidden bg-[#1e3a5f] p-8">

        //     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />

        //     <div className="text-center z-10 mt-2">
        //       <h1 className="text-3xl font-extrabold text-[#c5a059] tracking-widest uppercase">
        //         Completed Passport
        //       </h1>
        //       <div className="h-1 bg-[#c5a059] w-full mt-3" />
        //     </div>

        //     <div className="z-10 w-32 h-32 border-4 border-[#c5a059] rounded-full flex items-center justify-center">
        //       <span className="text-6xl">🏅</span>
        //     </div>

        //     <h2 className="text-[#c5a059] text-xl font-bold text-center px-4">
        //       Well Done {user.userId.split("@")[0].toUpperCase()}!
        //     </h2>

        //     <div className="absolute rotate-[-25deg] text-[55px] font-extrabold text-[#c5a059] opacity-80 border-4 border-[#c5a059] px-6 py-2">
        //       COMPLETED
        //     </div>

        //     <button
        //       onClick={onLogout}
        //       className="z-10 w-full bg-[#c5a059] text-[#1e3a5f] py-3 rounded-xl 
        //       font-bold text-lg shadow-lg active:scale-95 transition-all"
        //     >
        //       Logout / Restart
        //     </button>
        //   </div>
        // </div>
    );
};

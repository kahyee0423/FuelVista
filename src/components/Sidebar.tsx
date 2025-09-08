"use client";

import Image from "next/image";
import { TABS, TabType } from "../app/constants";

interface SidebarProps {
  tab: TabType;
  setTab: (t: TabType) => void;
  loadData: (force?: boolean) => void;
  loading: boolean;
}

export default function Sidebar({ tab, setTab, loadData, loading }: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col px-5 py-8 space-y-8 h-auto sticky top-0">
      <div className="px-2 select-none">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src="/assets/logo.png" 
              alt="logo"
              width={40}
              height={40}
              className="object-contain"
              priority 
            />
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
              FUELVISTA
            </h1>
            <p className="text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mt-1">
              MALAYSIA FUEL INSIGHTS
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col space-y-2 flex-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3.5 rounded-xl text-base font-medium text-left transition-all duration-300 flex items-center mb-3 group ${
              tab === t.key
                ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 shadow-md border border-blue-200/60"
                : "text-gray-600 hover:bg-gray-50/90 hover:text-gray-900"
            }`}
          >
            <span
              className={`mr-3 p-1.5 rounded-lg transition-colors duration-300 ${
                tab === t.key
                  ? "text-blue-600"
                  : "bg-transparent text-gray-500 group-hover:text-gray-700"
              }`}
            >
              {t.icon}
            </span>

            <span className="flex-1">{t.label}</span>

            {tab === t.key && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="px-2">
        <button
          onClick={() => loadData(true)}
          disabled={loading}
          className={`w-full px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 flex items-center justify-center ${
            loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Data
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
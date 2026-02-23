"use client";

import { Level } from "@/lib/types";

interface LevelSelectorProps {
  levels: Level[];
  currentLevel: number;
  onSelectLevel: (id: number) => void;
}

export default function LevelSelector({
  levels,
  currentLevel,
  onSelectLevel,
}: LevelSelectorProps) {
  return (
    <nav className="space-y-1.5">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
        Levels
      </h2>
      {levels.map((level) => {
        const isActive = level.id === currentLevel;
        return (
          <button
            key={level.id}
            onClick={() => onSelectLevel(level.id)}
            className={`level-card w-full text-left px-3 py-2.5 rounded-xl transition-all ${
              isActive
                ? "active bg-white shadow-sm"
                : "hover:bg-white/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  backgroundColor: `${level.color}18`,
                }}
              >
                {level.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold"
                    style={{ color: level.color }}
                  >
                    {level.id}
                  </span>
                  <span
                    className={`text-sm font-medium truncate ${
                      isActive ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {level.title}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {level.subtitle}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}

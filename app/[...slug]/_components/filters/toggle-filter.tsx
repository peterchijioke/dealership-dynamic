import React from 'react'

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    ariaLabel?: string;
}


export default function ShowSpecialToggle({ checked, onChange, ariaLabel }: ToggleProps) {
  return (
      <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={ariaLabel || "Toggle"}
          onClick={() => onChange(!checked)}
          onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(!checked);
              }
          }}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${checked ? "bg-black" : "bg-gray-300"
              }`}
      >
          <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-4" : "translate-x-0.5"
                  }`}
          />
      </button>
  )
}

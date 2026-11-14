"use client";

import { useEffect, useState } from "react";

const themes = [{ id: "light", label: "Light" }];

export default function ThemeChooser() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("books-theme");
    if (themes.some((option) => option.id === saved)) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("books-theme", theme);
  }, [theme]);

  return (
    <label className="theme-chooser">
      <span className="theme-icon" aria-hidden="true">☼</span>
      <span className="sr-only">Choose theme</span>
      <select value={theme} onChange={(event) => setTheme(event.target.value)}>
        {themes.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
      <svg className="theme-chevron" aria-hidden="true" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

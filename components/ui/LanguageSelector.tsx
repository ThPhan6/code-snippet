"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t("common.language")}:</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "vi")}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
      </select>
    </div>
  );
};

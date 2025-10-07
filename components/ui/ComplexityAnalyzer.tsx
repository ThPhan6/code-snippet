"use client";

import React, { useState, useEffect } from "react";
import {
  analyzeComplexity,
  getComplexityColor,
  getComplexityDescription,
} from "@/lib/analysis/complexity-analyzer";
import { useI18n } from "@/lib/i18n/context";

interface ComplexityAnalyzerProps {
  code: string;
  language: string;
  onAnalysisComplete?: (complexity: string) => void;
}

export const ComplexityAnalyzer: React.FC<ComplexityAnalyzerProps> = ({
  code,
  language,
  onAnalysisComplete,
}) => {
  const { t } = useI18n();
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (code && language) {
      analyzeCode();
    }
  }, [code, language]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    try {
      const result = analyzeComplexity(code, language);
      setAnalysis(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result.estimatedComplexity);
      }
    } catch (error) {
      console.error("Complexity analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!analysis && !isAnalyzing) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          {t("snippets.algorithmComplexity")}
        </h3>
        {isAnalyzing && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            {t("snippets.analyzing")}
          </div>
        )}
      </div>

      {analysis && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {t("snippets.estimated")}:
            </span>
            <span
              className={`font-mono font-semibold ${getComplexityColor(
                analysis.estimatedComplexity
              )}`}
            >
              {analysis.estimatedComplexity}
            </span>
            <span className="text-xs text-gray-500">
              ({Math.round(analysis.confidence * 100)}%{" "}
              {t("snippets.confidence")})
            </span>
          </div>

          <div className="text-sm text-gray-600">
            {getComplexityDescription(analysis.estimatedComplexity)}
          </div>

          {analysis.patterns.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                {t("snippets.detectedPatterns")}:
              </div>
              <div className="flex flex-wrap gap-1">
                {analysis.patterns.map((pattern: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.reasoning.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                {t("snippets.analysisDetails")}
              </summary>
              <ul className="mt-2 space-y-1 text-gray-600">
                {analysis.reasoning.map((reason: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/Button";
import { Loader2 } from "lucide-react";

export default function JobPageHeader(
  setJobType,
  currentJobType,
  isResumePresent,
  isLoading
) {
  return (
    <div className="w-full flex flex-col items-center px-4 py-3 sm:py-4">
      {isLoading && (
        <div className="w-full flex justify-center items-center mb-3">
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading {currentJobType} jobs...</span>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center overflow-x-auto pb-2">
        <div className="flex min-w-max space-x-2 px-1">
          <Button
            className={`text-sm sm:text-xl font-bold whitespace-nowrap px-3 sm:px-4 ${currentJobType === "all"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : ""
              }`}
            variant="ghost"
            onClick={() => setJobType("all")}
            disabled={isLoading}
          >
            {isLoading && currentJobType === "all" && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            ALL JOBS
          </Button>

          <Button
            className={`text-sm sm:text-base whitespace-nowrap px-3 sm:px-4 ${currentJobType === "recommended"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : ""
              } ${!isResumePresent ? "opacity-50 cursor-not-allowed" : ""}`}
            variant="ghost"
            onClick={() => (isResumePresent ? setJobType("recommended") : null)}
            title={!isResumePresent ? "Upload a resume to see recommendations" : ""}
            disabled={!isResumePresent || isLoading}
          >
            {isLoading && currentJobType === "recommended" && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Recommended
            {!isResumePresent && (
              <Badge className="ml-2 bg-yellow-200 text-yellow-900 text-[10px] hidden sm:inline-flex">
                Resume Required
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setJobType("bookmarked")}
            className={`text-sm sm:text-base whitespace-nowrap px-3 sm:px-4 ${currentJobType === "bookmarked"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : ""
              }`}
            disabled={isLoading}
          >
            {isLoading && currentJobType === "bookmarked" && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            <span className="hidden sm:inline">Bookmarked Jobs</span>
            <span className="sm:hidden">Bookmarked</span>
          </Button>

          <Button
            variant="ghost"
            className={`text-sm sm:text-base whitespace-nowrap px-3 sm:px-4 ${currentJobType === "applied"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : ""
              }`}
            onClick={() => setJobType("applied")}
            disabled={isLoading}
          >
            {isLoading && currentJobType === "applied" && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            <span className="hidden sm:inline">Applied Jobs</span>
            <span className="sm:hidden">Applied</span>
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-2 sm:hidden">
        <div className="w-16 h-1 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

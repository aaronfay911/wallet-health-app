import React from "react";
import BusinessDashboard from "../components/analytics/BusinessDashboard";

export default function Analytics() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <BusinessDashboard />
      </div>
    </div>
  );
}
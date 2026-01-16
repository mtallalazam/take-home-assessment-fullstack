// Dashboard Page - TO BE IMPLEMENTED BY CANDIDATE
// This is a basic placeholder structure

import { useEffect, useState } from "react"
import PortfolioSummary from "../components/PortfolioSummary"
import TopGainersAndLosers from "../components/TopGainerAndLosers"
import RecentNewsFeed from "../components/RecentNewsFeed"
import ActiveAlertsSummary from "../components/ActiveAlertsSummary"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) throw new Error("Failed to fetch dashboard data")
        const result = await response.json()
        setDashboardData(result?.data ?? result)
      } catch (err) {
        setError(err?.message ?? String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">📊 Dashboard</h1>

      <div className="mb-6">
        <PortfolioSummary />
      </div>

      <div className="mb-6">
        <TopGainersAndLosers
          topGainers={dashboardData?.topGainers ?? []}
          topLosers={dashboardData?.topLosers ?? []}
          loading={loading}
          error={error}
        />
      </div>

      <div className="mb-6">
        <RecentNewsFeed
          news={dashboardData?.recentNews ?? []}
          loading={loading}
          error={error}
        />
      </div>

      <ActiveAlertsSummary
        alerts={dashboardData?.activeAlerts ?? []}
        loading={loading}
        error={error}
      />
    </div>
  )
}

export default Dashboard

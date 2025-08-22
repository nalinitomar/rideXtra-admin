import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import { userData , GetAllDriver } from "api/data";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobStatusChart, setJobStatusChart] = useState({});
  const [jobTrendChart, setJobTrendChart] = useState({});
  const [jobCount , setJobCount] = useState(null)
  const [userCount , setUserCount] = useState(null)

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const userRes = await userData();
      console.log(userRes,'res4')
      setUsers(userRes.data.data || []);
      setUserCount(userRes.data.total)

      const jobRes = await GetAllDriver(1, 1000); // Fetch all jobs
      console.log(jobRes,'nnaabbc')
      const jobList = jobRes.data?.data || [];
      console.log(jobRes?.total,'total')
      setJobCount(jobRes?.total)

      console.log(jobList,'bbbcg')
      setJobs(jobList);

      // Chart: Jobs per Status
      const statusCount = { pending: 0, completed: 0, assigned: 0 };
   

      setJobStatusChart({
        labels: ["Pending", "Completed", "in_progress"],
        datasets: {
          label: "Jobs",
          data: [
            jobRes.total.pending || 0,
            jobRes.total.completed || 0,
            jobRes.total.in_progress || 0,
          ],
        },
      });

      // Chart: Jobs Posted Over Time (last 7 days)
      const dateMap = {};
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
        dateMap[label] = 0;
        return label;
      });

      jobList.forEach((job) => {
        const date = new Date(job.createdAt);
        const label = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
        if (label in dateMap) {
          dateMap[label] += 1;
        }
      });

      setJobTrendChart({
        labels: Object.keys(dateMap),
        datasets: { label: "Jobs", data: Object.values(dateMap) },
      });
    } catch (err) {
      console.error("Error loading dashboard data", err);
    }
  };

  console.log(jobCount,'jobc')

  const totalJobs = jobCount?.totalJobs
;
  const completedJobs = jobCount?.completed
  const pendingJobs = jobCount?.pending

  return (
    <DashboardLayout>
      <DashboardNavbar/>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              icon="person"
              title="Total Users"
              count={userCount}
              percentage={{ color: "success", label: "Updated now" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              icon="work"
              title="Total Driver"
              count={totalJobs}
              percentage={{ color: "success", label: "All-time" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              icon="check_circle"
              title="Completed Ride"
              count={completedJobs}
              percentage={{ color: "success", label: "Till date" }}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              icon="pending_actions"
              title="Pending Ride"
              count={pendingJobs}
              percentage={{ color: "error", label: "Needs attention" }}
              color="error"
            />
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <ReportsBarChart
                color="info"
                title="Ride"
                description="Current distribution"
                date="Just now"
                chart={jobStatusChart}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ReportsLineChart
                color="primary"
                title="Complete Ride"
                description={<strong>Last 7 Days</strong>}
                date="Live update"
                chart={jobTrendChart}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;

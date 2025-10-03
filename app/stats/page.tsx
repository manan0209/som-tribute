"use client";

import Link from "next/link";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import sampleUsers from "@/data/sample-users.json";
import sampleProjects from "@/data/sample-projects.json";
import timelineEvents from "@/data/timeline-events.json";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function StatsPage() {
  // Top 5 makers by shells
  const topMakersByShells = [...sampleUsers]
    .sort((a, b) => b.shells_earned - a.shells_earned)
    .slice(0, 5);

  const topMakersData = {
    labels: topMakersByShells.map(u => u.username),
    datasets: [
      {
        label: "Shells Earned",
        data: topMakersByShells.map(u => u.shells_earned),
        backgroundColor: "rgba(168, 149, 107, 0.8)",
        borderColor: "rgba(168, 149, 107, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Projects by technology
  const techCounts: Record<string, number> = {};
  sampleProjects.forEach(p => {
    p.technologies?.forEach(tech => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });
  });
  
  const topTechs = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const techData = {
    labels: topTechs.map(([tech]) => tech),
    datasets: [
      {
        label: "Projects Using Tech",
        data: topTechs.map(([, count]) => count),
        backgroundColor: [
          "rgba(230, 215, 184, 0.8)",
          "rgba(209, 193, 160, 0.8)",
          "rgba(168, 149, 107, 0.8)",
          "rgba(202, 179, 148, 0.8)",
          "rgba(139, 122, 84, 0.8)",
          "rgba(58, 47, 37, 0.8)",
          "rgba(241, 228, 195, 0.8)",
          "rgba(168, 149, 107, 0.6)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Activity timeline - events per week
  const eventsByWeek: Record<string, number> = {};
  timelineEvents.forEach(e => {
    const date = new Date(e.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    eventsByWeek[weekKey] = (eventsByWeek[weekKey] || 0) + 1;
  });

  const sortedWeeks = Object.entries(eventsByWeek)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(0, 12);

  const timelineData = {
    labels: sortedWeeks.map(([week]) => {
      const date = new Date(week);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Events per Week",
        data: sortedWeeks.map(([, count]) => count),
        borderColor: "rgba(168, 149, 107, 1)",
        backgroundColor: "rgba(168, 149, 107, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Project hours distribution
  const hourRanges = {
    "0-20h": 0,
    "21-40h": 0,
    "41-60h": 0,
    "61-80h": 0,
    "81+h": 0,
  };

  sampleProjects.forEach(p => {
    if (p.total_hours <= 20) hourRanges["0-20h"]++;
    else if (p.total_hours <= 40) hourRanges["21-40h"]++;
    else if (p.total_hours <= 60) hourRanges["41-60h"]++;
    else if (p.total_hours <= 80) hourRanges["61-80h"]++;
    else hourRanges["81+h"]++;
  });

  const hoursData = {
    labels: Object.keys(hourRanges),
    datasets: [
      {
        label: "Number of Projects",
        data: Object.values(hourRanges),
        backgroundColor: [
          "rgba(230, 215, 184, 0.8)",
          "rgba(209, 193, 160, 0.8)",
          "rgba(168, 149, 107, 0.8)",
          "rgba(139, 122, 84, 0.8)",
          "rgba(58, 47, 37, 0.8)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-vintage-beige">
      {/* Header */}
      <header className="border-b-4 border-vintage-brown py-8 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-block mb-4 text-vintage-brown hover:text-vintage-dark transition-colors">
            ← Back to Home
          </Link>
          <h1 className="masthead text-5xl md:text-7xl mb-3">
            Statistics
          </h1>
          <p className="font-steven text-xl md:text-2xl text-vintage-brown">
            Summer of Making 2025 by the numbers
          </p>
        </div>
      </header>

      {/* Key Metrics */}
      <section className="py-12 px-6 md:px-12 bg-vintage-tan">
        <div className="max-w-7xl mx-auto">
          <h2 className="newspaper-heading text-center mb-8">
            Key Metrics
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="organic-card text-center">
              <div className="text-5xl mb-3"></div>
              <div className="text-5xl font-bold text-vintage-brown mb-2">
                {sampleUsers.length}
              </div>
              <div className="font-steven text-lg text-vintage-dark">Total Makers</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-5xl mb-3">[Code]</div>
              <div className="text-5xl font-bold text-vintage-brown mb-2">
                {sampleProjects.length}
              </div>
              <div className="font-steven text-lg text-vintage-dark">Projects Shipped</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-5xl mb-3">⏰</div>
              <div className="text-5xl font-bold text-vintage-brown mb-2">
                {sampleUsers.reduce((acc, u) => acc + u.total_hours_worked, 0).toLocaleString()}
              </div>
              <div className="font-steven text-lg text-vintage-dark">Total Hours</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-5xl mb-3"></div>
              <div className="text-5xl font-bold text-vintage-brown mb-2">
                {Math.floor(sampleUsers.reduce((acc, u) => acc + u.shells_earned, 0) / 1000)}k
              </div>
              <div className="font-steven text-lg text-vintage-dark">Shells Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Top Makers Chart */}
          <div className="organic-card">
            <h3 className="font-national-park text-3xl font-bold text-vintage-dark mb-6 text-center">
               Top 5 Makers by Shells Earned
            </h3>
            <div className="h-80">
              <Bar data={topMakersData} options={chartOptions} />
            </div>
          </div>

          {/* Two Column Charts */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Technology Usage */}
            <div className="organic-card">
              <h3 className="font-national-park text-2xl font-bold text-vintage-dark mb-6 text-center">
                 Most Popular Technologies
              </h3>
              <div className="h-80">
                <Doughnut data={techData} options={doughnutOptions} />
              </div>
            </div>

            {/* Project Hours Distribution */}
            <div className="organic-card">
              <h3 className="font-national-park text-2xl font-bold text-vintage-dark mb-6 text-center">
                ⏱️ Project Hours Distribution
              </h3>
              <div className="h-80">
                <Bar data={hoursData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="organic-card">
            <h3 className="font-national-park text-3xl font-bold text-vintage-dark mb-6 text-center">
               Activity Timeline
            </h3>
            <div className="h-80">
              <Line data={timelineData} options={chartOptions} />
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="organic-card text-center">
              <div className="text-3xl mb-3">[Stats]</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {Math.round(sampleProjects.reduce((acc, p) => acc + p.total_hours, 0) / sampleProjects.length)}h
              </div>
              <div className="font-steven text-vintage-dark">Avg Hours per Project</div>
            </div>

            <div className="organic-card text-center">
              <div className="text-3xl mb-3"></div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {Math.round(sampleProjects.reduce((acc, p) => acc + p.shell_value, 0) / sampleProjects.length)}
              </div>
              <div className="font-steven text-vintage-dark">Avg Shell Value</div>
            </div>

            <div className="organic-card text-center">
              <div className="text-3xl mb-3">[Hot]</div>
              <div className="text-4xl font-bold text-vintage-brown mb-2">
                {Math.round(sampleUsers.reduce((acc, u) => acc + u.total_sessions, 0) / sampleUsers.length)}
              </div>
              <div className="font-steven text-vintage-dark">Avg Sessions per Maker</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="py-12 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="newspaper-heading text-center mb-8">
            Fun Facts
          </h2>
          
          <div className="space-y-4">
            <div className="organic-card">
              <div className="flex items-start gap-4">
                <div className="text-4xl"></div>
                <div>
                  <h4 className="font-national-park text-xl font-bold text-vintage-dark mb-2">
                    Most Productive Maker
                  </h4>
                  <p className="font-steven text-vintage-brown">
                    <strong>{topMakersByShells[0].username}</strong> earned {topMakersByShells[0].shells_earned.toLocaleString()} shells 
                    across {topMakersByShells[0].projects_count} projects!
                  </p>
                </div>
              </div>
            </div>

            <div className="organic-card">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚡</div>
                <div>
                  <h4 className="font-national-park text-xl font-bold text-vintage-dark mb-2">
                    Total Community Effort
                  </h4>
                  <p className="font-steven text-vintage-brown">
                    The community collectively worked <strong>{sampleUsers.reduce((acc, u) => acc + u.total_hours_worked, 0).toLocaleString()} hours</strong> - 
                    that's over {Math.round(sampleUsers.reduce((acc, u) => acc + u.total_hours_worked, 0) / 24)} days of non-stop building!
                  </p>
                </div>
              </div>
            </div>

            <div className="organic-card">
              <div className="flex items-start gap-4">
                <div className="text-4xl"></div>
                <div>
                  <h4 className="font-national-park text-xl font-bold text-vintage-dark mb-2">
                    Most Used Technology
                  </h4>
                  <p className="font-steven text-vintage-brown">
                    <strong>{topTechs[0][0]}</strong> was the most popular tech, 
                    used in {topTechs[0][1]} projects!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

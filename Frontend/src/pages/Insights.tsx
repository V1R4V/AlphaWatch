import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockData = [
  {
    id: "1",
    name: "TechCorp AI",
    industry: ["AI/ML", "Fintech"],
    location: "Bay Area",
    type: "B2B",
  },
  {
    id: "2",
    name: "BioHealth Solutions",
    industry: ["Bio Health"],
    location: "Seattle",
    type: "B2C",
  },
  {
    id: "3",
    name: "Crypto Dynamics",
    industry: ["Crypto", "Fintech"],
    location: "Remote",
    type: "Both",
  },
  {
    id: "4",
    name: "AI Labs",
    industry: ["AI/ML"],
    location: "Bay Area",
    type: "B2B",
  },
  {
    id: "5",
    name: "FinTech Solutions",
    industry: ["Fintech"],
    location: "Bay Area",
    type: "B2C",
  },
];

const locations = [
  "Remote",
  "Bay Area",
  "Washington DC",
  "Chicago",
  "LA",
  "Seattle",
  "Orange County",
  "New York",
];

const marketData = [
  { name: "AI/ML", value: 850 },
  { name: "Fintech", value: 720 },
  { name: "Dev Tools", value: 540 },
  { name: "Enterprise", value: 480 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22c55e'];

const Insights = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>("Bay Area");

  const typeDistribution = mockData.reduce((acc, company) => {
    acc[company.type] = (acc[company.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(typeDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const getLocationIndustryData = (location: string) => {
    const locationCompanies = mockData.filter(
      (company) => company.location === location
    );

    const industries = locationCompanies.reduce((acc, company) => {
      company.industry.forEach((ind) => {
        acc[ind] = (acc[ind] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(industries).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const locationIndustryData = getLocationIndustryData(selectedLocation);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-8 space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground">Top Industries Overview</h1>
              <p className="text-muted-foreground">
                Explore market valuations across leading industries
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `${value}`}
                    label={{ value: 'Market Valuation (Billions)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip formatter={(value) => `$${value}B`} />
                  <Bar dataKey="value" fill="#0F172A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-semibold mb-2">AI/ML</h3>
              <div className="text-3xl font-bold mb-2">$850B</div>
              <p className="text-muted-foreground">Market Valuation</p>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Fintech</h3>
              <div className="text-3xl font-bold mb-2">$720B</div>
              <p className="text-muted-foreground">Market Valuation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Company Types Distribution
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Industry Distribution by Location
                </h2>
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <Badge
                      key={location}
                      variant={
                        selectedLocation === location ? "default" : "outline"
                      }
                      className="cursor-pointer transition-all hover:scale-105 px-3 py-1"
                      onClick={() => setSelectedLocation(location)}
                    >
                      <MapPin className="h-3 w-3 mr-1.5" />
                      {location}
                    </Badge>
                  ))}
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationIndustryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {locationIndustryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Insights;

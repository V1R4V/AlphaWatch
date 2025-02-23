import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22c55e'];

const Insights = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [valuationData, setValuationData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/insights/valuation")
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data);
        setValuationData(
          data.map(company => ({
            name: company.name,
            value: company.value_usd / 1e9 // Convert to billions
          }))
        );
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-8 space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground">Valuation Insights</h1>
              <p className="text-muted-foreground">Top companies by market valuation</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
                <Home className="h-4 w-4" /> Home
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={valuationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}B`} />
                  <Tooltip formatter={(value) => `$${value}B`} />
                  <Bar dataKey="value" fill="#0F172A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Insights;

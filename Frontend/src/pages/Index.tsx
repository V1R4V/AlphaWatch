import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

interface Company {
  id: number;
  name: string;
  industries: string;
  investors: string;
  value_usd: number;
  last_funding_type: string;
  founded_date: string;
  num_employees: number;
  website: string;
  social_media_links: string;
  monthly_visits: number;
  about: string;
  address: string;
  country_code: string;
  cb_rank: number;
  full_description: string;
  image: string;
}

const locations = [
  "California", "New York", "Illinois", "Texas", "Massachusetts", 
  "United States", "North America", "Europe", "Asia",
];

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/companies");
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to fetch companies", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleLocation = (location: string) => {
    setSelectedLocation((prev) =>
      prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]
    );
  };

  const filteredData = companies.filter((company) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    const matchesIndustry = company.industries?.toLowerCase().includes(lowercasedSearchTerm);
    const matchesSearch = company.name?.toLowerCase().includes(lowercasedSearchTerm);
    const matchesLocationSearch = company.address?.toLowerCase().includes(lowercasedSearchTerm); // Added location search

    const matchesLocation = selectedLocation.length === 0 || 
      selectedLocation.some((loc) => company.address?.toLowerCase().includes(loc.toLowerCase()));

    return (matchesIndustry || matchesSearch || matchesLocationSearch) && matchesLocation;
  });

  const handleCompanyClick = (id: number) => {
    navigate(`/company/${id}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-8 space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Companies</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/insights")}>
                <BarChart className="h-4 w-4" /> Insights
              </Button>
              <ThemeToggle />
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search companies, industries, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full max-w-md"
            />
          </div>

          {/* Location filter buttons */}
          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            {locations.map((location) => (
              <Badge
                key={location}
                variant={selectedLocation.includes(location) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105 px-3 py-1"
                onClick={() => toggleLocation(location)}
              >
                <MapPin className="h-3 w-3 mr-1.5" />
                {location}
              </Badge>
            ))}
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Logo</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Industry</TableHead>
                <TableHead className="text-center">Location</TableHead>
                <TableHead className="text-center">Investors</TableHead>
                <TableHead className="text-center">Value (USD)</TableHead>
                <TableHead className="text-center">Founded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((company) => (
                <TableRow key={company.id} onClick={() => handleCompanyClick(company.id)}>
                  <TableCell>
                    <img src={company.image || "https://via.placeholder.com/80"} className="w-10 h-10" />
                  </TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.industries || "N/A"}</TableCell>
                  <TableCell>{company.address || "N/A"}</TableCell>
                  <TableCell>{company.investors || "N/A"}</TableCell>
                  <TableCell>{company.value_usd ? `$${company.value_usd.toLocaleString()}` : "N/A"}</TableCell>
                  <TableCell>{company.founded_date || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;

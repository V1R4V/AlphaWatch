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

const industries = ["AI/ML", "Bio Health", "Crypto", "Fintech", "Hardware"];
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

const Index = () => {
  const navigate = useNavigate();
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch companies from the backend
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

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const filteredData = companies.filter((company) => {
    const matchesIndustry =
      selectedIndustries.length === 0 ||
      company.industries.split(",").some((i) => selectedIndustries.includes(i.trim()));
    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(company.address);
    const matchesSearch =
      searchTerm === "" ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesIndustry && matchesLocation && matchesSearch;
  });

  const handleCompanyClick = (id: number) => {
    navigate(`/company/${id}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-8 space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Companies</h1>
            <Button variant="outline" onClick={() => navigate("/insights")}>
              <BarChart className="h-4 w-4" /> Insights
            </Button>
            <ThemeToggle />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full max-w-md"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((company) => (
                <TableRow key={company.id} onClick={() => handleCompanyClick(company.id)}>
                  <TableCell><img src={company.image || "https://via.placeholder.com/80"} className="w-10 h-10" /></TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.industries}</TableCell>
                  <TableCell>{company.address}</TableCell>
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

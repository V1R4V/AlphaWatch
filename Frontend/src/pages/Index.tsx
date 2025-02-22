import React, { useState } from "react";
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

interface Prospect {
  id: string;
  logo: string;
  name: string;
  employees: string;
  industry: string[];
  location: string;
  type: "B2B" | "B2C" | "Both";
}

const mockData: Prospect[] = [
  {
    id: "1",
    logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=80&h=80&fit=crop",
    name: "TechCorp AI",
    employees: "50-100",
    industry: ["AI/ML", "Fintech"],
    location: "Bay Area",
    type: "B2B",
  },
  {
    id: "2",
    logo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=80&h=80&fit=crop",
    name: "BioHealth Solutions",
    employees: "100-250",
    industry: ["Bio Health"],
    location: "Seattle",
    type: "B2C",
  },
  {
    id: "3",
    logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=80&h=80&fit=crop",
    name: "Crypto Dynamics",
    employees: "25-50",
    industry: ["Crypto", "Fintech"],
    location: "Remote",
    type: "Both",
  },
];

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

  const filteredData = mockData.filter((prospect) => {
    const matchesIndustry =
      selectedIndustries.length === 0 ||
      prospect.industry.some((i) => selectedIndustries.includes(i));
    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(prospect.location);
    const matchesSearch =
      searchTerm === "" ||
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesIndustry && matchesLocation && matchesSearch;
  });

  const handleCompanyClick = (id: string) => {
    navigate(`/company/${id}`);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-8 space-y-8 animate-fadeIn">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-foreground">Companies</h1>
                <p className="text-muted-foreground">Browse and filter company prospects</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/insights")}
                  className="gap-2"
                >
                  <BarChart className="h-4 w-4" />
                  Insights
                </Button>
                <ThemeToggle />
              </div>
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

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant={
                        selectedIndustries.includes(industry) ? "default" : "outline"
                      }
                      className="cursor-pointer transition-all hover:scale-105 px-3 py-1"
                      onClick={() => toggleIndustry(industry)}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <Badge
                      key={location}
                      variant={
                        selectedLocations.includes(location) ? "default" : "outline"
                      }
                      className="cursor-pointer transition-all hover:scale-105 px-3 py-1"
                      onClick={() => toggleLocation(location)}
                    >
                      <MapPin className="h-3 w-3 mr-1.5" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] font-medium">Logo</TableHead>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Employees</TableHead>
                  <TableHead className="font-medium">Industry</TableHead>
                  <TableHead className="font-medium">Location</TableHead>
                  <TableHead className="font-medium">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((prospect) => (
                  <TableRow
                    key={prospect.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors group"
                    onClick={() => handleCompanyClick(prospect.id)}
                  >
                    <TableCell className="py-4">
                      <img
                        src={prospect.logo}
                        alt={`${prospect.name} logo`}
                        className="w-10 h-10 rounded-lg object-cover border"
                        loading="lazy"
                      />
                    </TableCell>
                    <TableCell className="font-medium group-hover:text-primary transition-colors">
                      {prospect.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{prospect.employees}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {prospect.industry.map((ind) => (
                          <Badge
                            key={ind}
                            variant="outline"
                            className="text-xs"
                          >
                            {ind}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1.5 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{prospect.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        <Globe className="h-3 w-3 mr-1.5" />
                        {prospect.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;

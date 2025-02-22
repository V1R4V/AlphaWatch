import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { getAllCompanies } from "../../../Backend/services/companyService.tsx";
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

const Index = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllCompanies().then((data) => setCompanies(data));
  }, []);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const filteredData = companies.filter((prospect) => {
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
                <Button variant="outline" onClick={() => navigate("/insights")} className="gap-2">
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
                          <Badge key={ind} variant="outline" className="text-xs">
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
                      <Badge variant="outline" className="text-xs">
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

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
  social_media_links: string; // Assuming it's a comma-separated list of links or an array
  monthly_visits: number;
  address: string;
  country_code: string;
  cb_rank: number;
  full_description: string;
  image: string;
}

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // Get the company ID from the URL
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!id) {
        setError("Invalid company ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/company/${id}`);
        if (!response.ok) {
          throw new Error("Company not found");
        }
        const data: Company = await response.json();
        setCompany(data);
      } catch (err) {
        setError("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  // Parse social media links (assuming they are comma-separated strings)
  const socialLinks = company.social_media_links.split(",").map((link, index) => (
    <div key={index}>
      <a href={link.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {link.trim()}
      </a>
    </div>
  ));

  return (
    <div className="p-8 space-y-6">
      {/* Image at the top */}
      <div className="mb-6">
        <img 
          src={company.image || "https://via.placeholder.com/200"} 
          alt={company.name} 
          className="w-full h-64 object-cover rounded-lg" 
        />
      </div>

      <h1 className="text-3xl font-semibold">{company.name}</h1>
      
      <div className="space-y-4">
        <p className="text-lg">{company.full_description}</p>
        <div>
          <h3 className="text-xl font-semibold">Industry:</h3>
          <p>{company.industries}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Location:</h3>
          <p>{company.address}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Website:</h3>
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
            {company.website}
          </a>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Social Media:</h3>
          {socialLinks}
        </div>
      </div>

      {/* Link back to home page */}
      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CompanyDetails;

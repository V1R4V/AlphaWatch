
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import CompanyDetails from "./pages/companyDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;


import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{location.pathname}</span>
        </p>
        <Button asChild size="lg">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

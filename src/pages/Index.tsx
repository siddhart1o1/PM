import { Navigate } from "react-router-dom";

// Redirect to the board page
const Index = () => {
  return <Navigate to="/board" replace />;
};

export default Index;

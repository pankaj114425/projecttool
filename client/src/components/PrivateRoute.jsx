// import React from "react";
// import { Route,  Navigate } from "react-router-dom";
// import useConfigurator from "../context/Configurator";



// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const { isAuthenticated, user, loading } = useConfigurator()

//   return (
//     <Route
//       {...rest}
//       render={(props) => {
//         if (loading) return null; 
//         return user ? <Component {...props} /> : <Navigate to="/" />;
//       }}
//     />
//   );
// };

// export default PrivateRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import useConfigurator from "../context/Configurator";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useConfigurator();

  if (loading) return null;

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;

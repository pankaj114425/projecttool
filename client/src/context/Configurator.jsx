import { createContext, useContext, useEffect, useRef, useState } from "react";

const ConfiguratorContext = createContext();

export const ConfiguratorProvider = ({ children }) => {
  const [projectDetail,setProjectDetail]=useState({})

   const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    useEffect(() => {
      const dataitem = sessionStorage.getItem('user');
      if (dataitem) {
        setUser(true); 
      }
      setLoading(false); 
    }, []);
  return (
    <ConfiguratorContext.Provider
      value={{
       projectDetail,setProjectDetail,user,isAuthenticated: !!user, loading,setUser
      }}>
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  return useContext(ConfiguratorContext);
};

export default useConfigurator;

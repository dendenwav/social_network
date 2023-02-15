import React, { createContext, useState } from 'react';

const AuthorizationContext = createContext({});

const AuthorizationProvider = ({ children }) => {
  const [authorization, setAuthorization] = useState(null);

  return (
    <AuthorizationContext.Provider value={{ authorization, setAuthorization }}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export { AuthorizationContext, AuthorizationProvider };

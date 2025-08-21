import { Route, Routes } from "react-router-dom";
import MapPage from "./(root)/MapPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FormspreeProvider } from "@formspree/react";
import CrowdSource from "./(root)/sidemenu/CrowdSource";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <FormspreeProvider>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/CrowdSource" element={<CrowdSource />} />
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
      </FormspreeProvider>
    </QueryClientProvider>
  );
};

export default App;

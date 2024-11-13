import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Trending from "./pages/Trending";
import CryptoDetail from "./pages/CryptoDetail";
import Portfolio from "./pages/Portfolio";
import News from "./pages/News";
import Profile from "./pages/Profile";
import MainNav from "./components/NavigationMenu";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <MainNav />
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/markets/trending" element={<Trending />} />
            <Route path="/crypto/:id" element={<CryptoDetail />} />
            <Route path="/portfolio/overview" element={<Portfolio />} />
            <Route path="/news" element={<News />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
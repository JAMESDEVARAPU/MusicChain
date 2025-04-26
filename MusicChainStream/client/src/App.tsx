import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Library from "@/pages/Library";
import ArtistDetail from "@/pages/ArtistDetail";
import PlaylistDetail from "@/pages/PlaylistDetail";
import ArtistPayments from "@/pages/ArtistPayments";
import ArtistDashboard from "@/pages/ArtistDashboard";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import { BlockchainProvider } from "@/contexts/BlockchainContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/library" component={Library} />
      <Route path="/artist/:id" component={ArtistDetail} />
      <Route path="/playlist/:id" component={PlaylistDetail} />
      <Route path="/payments" component={ArtistPayments} />
      <Route path="/artist-dashboard" component={ArtistDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlockchainProvider>
        <PlayerProvider>
          <TooltipProvider>
            <Toaster />
            <div className="flex flex-col md:flex-row h-screen">
              <Sidebar />
              <div className="main-content flex-1 md:ml-64 bg-gradient-to-b from-[#282828] to-[#121212] min-h-screen pb-24">
                <Router />
              </div>
              <Player />
            </div>
          </TooltipProvider>
        </PlayerProvider>
      </BlockchainProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "@/pages/home";
import Pathfinder from "@/pages/pathfinder";
import Sorting from "@/pages/sorting";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pathfinder" component={Pathfinder} />
      <Route path="/sorting" component={Sorting} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;

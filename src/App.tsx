
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout/Layout";
import Dashboard from "@/components/Dashboard/Dashboard";
import EmployeeList from "@/components/Employees/EmployeeList";
import ProjectList from "@/components/Projects/ProjectList";
import TaskList from "@/components/Tasks/TaskList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/employees" element={
              <Layout>
                <EmployeeList />
              </Layout>
            } />
            <Route path="/projects" element={
              <Layout>
                <ProjectList />
              </Layout>
            } />
            <Route path="/tasks" element={
              <Layout>
                <TaskList />
              </Layout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout.tsx";
import Teams from "./pages/Teams.tsx";
import Approves from "./pages/Approves.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";
import Employees from "./pages/Employees.tsx";
import Requests from "./pages/Requests.tsx";
import TimeTracker from "./pages/TimeTracker.tsx";
import WorkCalendar from "./pages/Calendar.tsx";

const router = createBrowserRouter([
   {
      path: "/",
      element: <AppLayout />,
      children: [
         {
            path: "/employees",
            element: <Employees />,
         },
         {
            path: "/time-tracker",
            element: <TimeTracker />,
         },
         {
            path: "/teams",
            element: <Teams />,
         },
         {
            path: "/calendar",
            element: <WorkCalendar />,
         },
         {
            path: "/approves",
            element: <Approves />,
         },
         {
            path: "/requests",
            element: <Requests />,
         },
         {
            path: "/settings",
            element: <Settings />,
         },
      ],
   },
   {
      path: "*",
      element: <NotFound />,
   },
]);

function App() {
   return <RouterProvider router={router} />;
}

export default App;

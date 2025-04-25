import CalendarComponent from "./components/calendar"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto mt-8">
          <CalendarComponent />
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App

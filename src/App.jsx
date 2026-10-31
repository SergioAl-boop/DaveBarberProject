import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RutaAdmin from "./components/RutaAdmin";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
        
       <Route
        path="/admin"
        element={
          <RutaAdmin>
            <h1>Panel del barbero</h1>
          </RutaAdmin>
        }
      />
    </Routes>
  );
}

export default App;
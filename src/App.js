import { useState, useEffect } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import JsonTreeVisualizer from "./Compontes/json-tree-visualizer";

function App() {
  const [isDark, setIsDark] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
    setIsDark(savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  return (
    <div>
      <Navbar
        bg={isDark ? "dark" : "light"}
        data-bs-theme={isDark ? "dark" : "light"} 
        expand="lg"
        className="border-bottom"
      >
        <Container>
          <Navbar.Brand className="fw-bold fs-4">JSON Tree Visualizer</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Button
                variant={isDark ? "light" : "outline-secondary"}
                onClick={toggleTheme}
                className="ms-2"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? "☀️" : "🌙"}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-5">
        <p className="text-muted mb-4">
          Visualize and explore JSON structures interactively
        </p>
        <JsonTreeVisualizer />
      </Container>
    </div>
  );
}

export default App;

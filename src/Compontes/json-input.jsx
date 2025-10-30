
import { useState } from "react";
import { Form, Button, ButtonGroup, Alert } from "react-bootstrap";

const SAMPLE_JSON = {
  user: {
    id: 1,
    name: "Satyam Khule",
    email: "satyamkhule179@gmail.com",
    address: {
      street: "Survey no - 657, plot no - 50/51 Saj Niwas, Infront of Mahindra Gate no- 2 Subhashwadi, Nighoje",
      city: "Pune",
      country: "India",
      zipCode: " 410501",
    },
    hobbies: ["reading", "gaming", "coding"],
  },
  posts: [
    {
      id: 1,
      title: "First Post",
      content: "Hello World",
      likes: 42,
    },
    {
      id: 2,
      title: "Second Post",
      content: "React is awesome",
      likes: 128,
    },
  ],
  isActive: true,
  score: 95.5,
};

export default function JsonInput({ onSubmit }) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");

  const validateAndParse = (text) => {
    try {
      const parsed = JSON.parse(text);
      setError("");
      return parsed;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleVisualize = () => {
    const parsed = validateAndParse(jsonText);
    if (parsed) {
      onSubmit(parsed);
    }
  };

  const handleLoadSample = () => {
    setJsonText(JSON.stringify(SAMPLE_JSON, null, 2));
    setError("");
  };

  const handleClear = () => {
    setJsonText("");
    setError("");
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">JSON Input</h5>

        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              if (e.target.value) {
                validateAndParse(e.target.value);
              }
            }}
            placeholder={`Paste your JSON here...\n\nExample:\n${JSON.stringify(
              { name: "Satyam", age: 22 },
              null,
              2
            )}`}
            rows={12}
            className="font-monospace"
            style={{ fontSize: "0.875rem" }}
          />
        </Form.Group>

        {error && (
          <Alert
            variant="danger"
            className="d-flex gap-2 align-items-start mb-3"
          >
            <div className="fw-bold">!</div>
            <div>
              <div className="fw-semibold">Invalid JSON</div>
              <small>{error}</small>
            </div>
          </Alert>
        )}

        <ButtonGroup className="w-100" role="group">
          <Button
            variant="primary"
            onClick={handleVisualize}
            disabled={!jsonText || error}
            className="flex-grow-1"
          >
            Visualize
          </Button>
          <Button
            variant="secondary"
            onClick={handleLoadSample}
            className="flex-grow-1"
          >
            Sample
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            className="flex-grow-1"
          >
            Clear
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

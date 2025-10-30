import { useState, useCallback, useRef } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import JsonInput from "./json-input";
import { generateTreeFromJson, findNodeByPath } from "../Lib/json-parser";

export default function JsonTreeVisualizer() {
  const [treeData, setTreeData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [highlightedPath, setHighlightedPath] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [zoom, setZoom] = useState(100);
  const treeContainerRef = useRef(null);
  const highlightedNodeRef = useRef(null);

  const handleJsonSubmit = useCallback((jsonData) => {
    try {
      const tree = generateTreeFromJson(jsonData);
      setTreeData(tree);
      setHighlightedPath(null);
      setSearchQuery("");
      setMessage("");
      setExpandedNodes(new Set());
      setZoom(100);
    } catch (error) {
      setMessage("Error generating tree: " + error.message);
      setMessageType("error");
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setMessage("Please enter a search query");
      setMessageType("error");
      return;
    }

    if (treeData) {
      const found = findNodeByPath(treeData, searchQuery);
      if (found) {
        setHighlightedPath(found.path);
        setMessage(`✓ Match found: ${found.path}`);
        setMessageType("success");

        // Expand all parent nodes to show the match
        const pathParts = found.path.split(/[.[\]]/).filter((p) => p);
        const newExpanded = new Set(expandedNodes);

        let currentPath = "$";
        pathParts.forEach((part, index) => {
          if (index < pathParts.length - 1) {
            if (!isNaN(part)) {
              currentPath += `[${part}]`;
            } else {
              currentPath += `.${part}`;
            }
            newExpanded.add(currentPath);
          }
        });

        setExpandedNodes(newExpanded);

        setTimeout(() => {
          if (highlightedNodeRef.current) {
            highlightedNodeRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      } else {
        setHighlightedPath(null);
        setMessage("✗ No match found");
        setMessageType("error");
      }
    }
  }, [treeData, searchQuery, expandedNodes]);

  const handleClearAll = useCallback(() => {
    setTreeData(null);
    setSearchQuery("");
    setHighlightedPath(null);
    setMessage("");
    setExpandedNodes(new Set());
    setZoom(100);
  }, []);

  const handleCopyPath = useCallback((path) => {
    navigator.clipboard.writeText(path);
    setMessage(`Copied: ${path}`);
    setMessageType("success");
    setTimeout(() => setMessage(""), 2000);
  }, []);

  const toggleNode = (path) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const countNodes = (node) => {
    let count = 1;
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + countNodes(child), 0);
    }
    return count;
  };

  return (
    <Container fluid>
      <Row className="g-4">
        <Col lg={3}>
          <JsonInput onSubmit={handleJsonSubmit} />
        </Col>

        <Col lg={9}>
          <div className="space-y-3">
            <div className="card">
              <div className="card-body">
                <label className="form-label fw-semibold">
                  Search by JSON Path
                </label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="e.g., $.user.address.city or posts[0].title"
                  />
                  <Button variant="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </div>
                <small className="text-muted d-block mt-2">
                  Use dot notation ($.user.name) or bracket notation
                  (items[0].id)
                </small>
              </div>
            </div>

            {message && (
              <Alert
                variant={messageType === "success" ? "success" : "danger"}
                className="mb-0"
              >
                <div className="d-flex gap-2 align-items-start">
                  <div className="fw-bold">
                    {/* {messageType === "success" ? "✓" : "✗"} */}
                  </div>
                  <div>{message}</div>
                </div>
              </Alert>
            )}

            <div className="d-flex gap-2">
              <Button
                variant="danger"
                onClick={handleClearAll}
                className="flex-grow-1"
              >
                Clear All
              </Button>
            </div>

            {treeData && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex gap-2 align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setZoom(Math.max(50, zoom - 10))}
                    >
                      −
                    </Button>
                    <span
                      className="fw-semibold"
                      style={{ minWidth: "50px", textAlign: "center" }}
                    >
                      {zoom}%
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setZoom(Math.min(200, zoom + 10))}
                    >
                      +
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setZoom(100)}
                      className="ms-auto"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {treeData && (
              <div className="card bg-light">
                <div className="card-body">
                  <small className="text-muted">
                    <span className="fw-semibold text-dark">
                      {countNodes(treeData)}
                    </span>{" "}
                    total nodes
                  </small>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {treeData && (
        <Row className="mt-4">
          <Col>
            <div className="card">
              <div
                className="card-body"
                style={{ height: "600px", overflowY: "auto" }}
                ref={treeContainerRef}
              >
                <div
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top left",
                  }}
                >
                  <TreeNodeComponent
                    node={treeData}
                    expanded={expandedNodes}
                    onToggle={toggleNode}
                    highlighted={highlightedPath}
                    onCopyPath={handleCopyPath}
                    highlightedNodeRef={highlightedNodeRef}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {!treeData && (
        <Row className="mt-4">
          <Col>
            <div className="card text-center">
              <div className="card-body py-5">
                <p className="text-muted">
                  Paste or type JSON data to visualize the tree structure
                </p>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

function TreeNodeComponent({
  node,
  expanded,
  onToggle,
  highlighted,
  onCopyPath,
  highlightedNodeRef,
}) {
  const isExpanded = expanded.has(node.path);
  const hasChildren = node.children && node.children.length > 0;
  const isHighlighted = highlighted === node.path;

  const getNodeColor = () => {
    switch (node.type) {
      case "object":
        return "bg-info bg-opacity-10 border-info";
      case "array":
        return "bg-success bg-opacity-10 border-success";
      case "primitive":
        return "bg-warning bg-opacity-10 border-warning";
      default:
        return "bg-secondary bg-opacity-10 border-secondary";
    }
  };

  const highlightStyle = isHighlighted
    ? {
        backgroundColor: "#fff3cd",
        borderColor: "#ffc107",
        borderWidth: "3px",
        boxShadow: "0 0 10px rgba(255, 193, 7, 0.5)",
      }
    : {};

  return (
    <div className="mb-2" ref={isHighlighted ? highlightedNodeRef : null}>
      <div
        className={`d-flex align-items-center gap-2 p-2 rounded border ${getNodeColor()}`}
        style={highlightStyle}
      >
        {hasChildren && (
          <button
            onClick={() => onToggle(node.path)}
            className="btn btn-sm btn-link p-0 text-decoration-none"
            style={{ minWidth: "24px" }}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        )}
        {!hasChildren && <div style={{ width: "24px" }} />}

        <div className="flex-grow-1 text-truncate">
          <div className="font-monospace fw-semibold small text-truncate">
            {node.key}
          </div>
          {node.value !== undefined && (
            <div className="small opacity-75 text-truncate">
              {typeof node.value === "string"
                ? `"${node.value}"`
                : String(node.value)}
            </div>
          )}
        </div>

        <button
          onClick={() => onCopyPath(node.path)}
          className="btn btn-sm btn-link p-0 text-decoration-none"
          title="Copy path"
        >
          📋
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div className="ms-3 ps-2 border-start">
          {node.children.map((child, idx) => (
            <TreeNodeComponent
              key={`${node.path}-${idx}`}
              node={child}
              expanded={expanded}
              onToggle={onToggle}
              highlighted={highlighted}
              onCopyPath={onCopyPath}
              highlightedNodeRef={highlightedNodeRef}
            />
          ))}
        </div>
      )}
    </div>
  );
}

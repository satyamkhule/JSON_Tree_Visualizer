
import { Handle, Position } from "reactflow";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function TreeNode({ data }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getNodeColor = () => {
    switch (data.type) {
      case "object":
        return "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100";
      case "array":
        return "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100";
      case "primitive":
        return "bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-100";
      default:
        return "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100";
    }
  };

  const getTypeLabel = () => {
    switch (data.type) {
      case "object":
        return "Object";
      case "array":
        return "Array";
      case "primitive":
        return data.value === null ? "null" : typeof data.value;
      default:
        return "Node";
    }
  };

  return (
    <div
      className={`relative ${
        data.isHighlighted ? "ring-4 ring-yellow-400 dark:ring-yellow-300" : ""
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Handle type="target" position={Position.Top} />

      <div
        className={`px-3 py-2 rounded-lg border-2 min-w-max cursor-pointer transition-all ${getNodeColor()} ${
          data.isHighlighted ? "shadow-lg scale-110" : "shadow"
        }`}
      >
        <div className="flex items-center gap-2">
          <div>
            <p className="font-semibold text-xs">{data.label}</p>
            <p className="text-xs opacity-75">{getTypeLabel()}</p>
            {data.type === "primitive" && data.value !== null && (
              <p className="text-xs font-mono mt-1 opacity-90 max-w-xs truncate">
                {String(data.value).substring(0, 30)}
              </p>
            )}
          </div>
          <button
            onClick={() => data.onCopyPath(data.path)}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors flex-shrink-0"
            title="Copy path"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
          {data.path}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

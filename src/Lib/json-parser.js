const generateTreeFromJson = (jsonData) => {
  const processValue = (value, key, path) => {
    if (value === null) {
      return {
        key,
        type: "primitive",
        value: null,
        path,
        children: [],
      }
    } else if (typeof value === "object") {
      if (Array.isArray(value)) {
        const children = value.map((item, index) => {
          const itemPath = `${path}[${index}]`
          return processValue(item, `[${index}]`, itemPath)
        })

        return {
          key,
          type: "array",
          value: `Array(${value.length})`,
          path,
          children,
        }
      } else {
        const children = Object.entries(value).map(([objKey, objValue]) => {
          const objPath = `${path}.${objKey}`
          return processValue(objValue, objKey, objPath)
        })

        return {
          key,
          type: "object",
          value: "Object",
          path,
          children,
        }
      }
    } else {
      return {
        key,
        type: "primitive",
        value,
        path,
        children: [],
      }
    }
  }

  if (typeof jsonData === "object" && jsonData !== null) {
    if (Array.isArray(jsonData)) {
      const children = jsonData.map((item, index) => {
        return processValue(item, `[${index}]`, `$[${index}]`)
      })

      return {
        key: "root",
        type: "array",
        value: `Array(${jsonData.length})`,
        path: "$",
        children,
      }
    } else {
      const children = Object.entries(jsonData).map(([key, value]) => {
        return processValue(value, key, `$.${key}`)
      })

      return {
        key: "root",
        type: "object",
        value: "Object",
        path: "$",
        children,
      }
    }
  }

  throw new Error("JSON data must be an object or array")
}

const normalizeSearchPath = (searchPath) => {
  let normalized = searchPath.trim()

  // Remove leading $ if present
  if (normalized.startsWith("$")) {
    normalized = normalized.substring(1)
  }

  // Remove leading dot if present
  if (normalized.startsWith(".")) {
    normalized = normalized.substring(1)
  }

  return normalized
}

const findNodeByPath = (node, searchPath) => {
  const normalized = normalizeSearchPath(searchPath)

  let nodePath = node.path
  if (nodePath.startsWith("$.")) {
    nodePath = nodePath.substring(2)
  } else if (nodePath.startsWith("$")) {
    nodePath = nodePath.substring(1)
  }

  if (nodePath === normalized || node.path === searchPath) {
    return node
  }


  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      const result = findNodeByPath(child, searchPath)
      if (result) return result
    }
  }

  return null
}

const getAllNodePaths = (node, paths = []) => {
  paths.push(node.path)
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => getAllNodePaths(child, paths))
  }
  return paths
}

export { generateTreeFromJson, findNodeByPath, normalizeSearchPath, getAllNodePaths }

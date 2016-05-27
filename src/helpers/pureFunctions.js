export const underscoreToCamelCase = underscored_text =>
  underscored_text.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); })


export const ApiServiceErrorsCodes = {
  UNDEFINED_CLIENT_ERROR: 'UNDEFINED_CLIENT_ERROR'
  <% _.forEach(_.sortBy(spec.errors), function (name) { %>
    ,<%= name %>: '<%= name %>'
  <% }) %>
}

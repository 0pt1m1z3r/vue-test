// Autogenerated file

import { IHttpPromise, IHttpRequestConfig } from '~/services/http'

<% _.forEach(spec.definitions, function (definition) { %>
  import { <%= definition.name %> } from './definitions/<%= definition.name %>'
<% }) %>
<% _.forEach(spec.params, function (param) { %>
  import { <%= param.name %> } from './params/<%= param.name %>'
<% }) %>
<% _.forEach(spec.responses, function (response) { %>
  import { <%= response.name %> } from './responses/<%= response.name %>'
<% }) %>

export interface IApiService {
<% _.forEach(spec.operations, function (op) { %>
  <%= op.operationId %> (params<%= op.paramInterfaceName ? `: ${op.paramInterfaceName}` : '?: void | null' %>, config?: IHttpRequestConfig): IHttpPromise<<%= op.responseInterfaceName ? op.responseInterfaceName : 'void' %>>
<% }) %>
}

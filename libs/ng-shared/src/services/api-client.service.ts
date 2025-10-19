import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { apiEndpoints, ApiDomain, ApiEndpointKey } from './api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private api = inject(ApiService);

  call<D extends ApiDomain, E extends ApiEndpointKey<D>>(
    domain: D,
    endpoint: E
  ): Promise<any>;

  call<D extends ApiDomain, E extends ApiEndpointKey<D>>(
    domain: D,
    endpoint: E,
    body: any
  ): Promise<any>;

  call<D extends ApiDomain, E extends ApiEndpointKey<D>>(
    domain: D,
    endpoint: E,
    body: undefined,
    pathParams: Record<string, string | number>
  ): Promise<any>;

  call<D extends ApiDomain, E extends ApiEndpointKey<D>>(
    domain: D,
    endpoint: E,
    body: any,
    pathParams: Record<string, string | number>
  ): Promise<any>;

  async call<D extends ApiDomain, E extends ApiEndpointKey<D>>(
    domain: D,
    endpoint: E,
    body?: any,
    pathParams?: Record<string, string | number>
  ): Promise<any> {
    const contract = apiEndpoints[domain][endpoint] as any;
    let path = contract.path;
    const { method, options } = contract;

    if (pathParams) {
      Object.keys(pathParams).forEach((key) => {
        path = path.replace(`:${key}`, String(pathParams[key]));
      });
    }

    switch (method) {
      case 'GET':
        return this.api.get(path, options);
      case 'POST':
        return this.api.post(path, body, options);
      case 'PUT':
        return this.api.put(path, body, options);
      case 'PATCH':
        return this.api.patch(path, body, options);
      case 'DELETE':
        return this.api.delete(path, options);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
import { UserResponse, SupabaseUserDto } from '@cigaro/shared';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiEndpoint<TRequest = void, TResponse = unknown, TPathParams = void> {
  method: HttpMethod;
  path: string;
  request?: TRequest;
  response: TResponse;
  pathParams?: TPathParams;
  options?: {
    retryAttempts?: number;
    withCredentials?: boolean;
  };
}

export const apiEndpoints = {
  auth: {
    syncUser: {
      method: 'POST',
      path: '/auth/user',
      request: {} as SupabaseUserDto,
      response: {} as UserResponse,
      options: { retryAttempts: 2 }
    } as ApiEndpoint<SupabaseUserDto, UserResponse>,

    getCurrentUser: {
      method: 'GET',
      path: '/auth/me',
      response: {} as UserResponse
    } as ApiEndpoint<void, UserResponse>,

    getUserById: {
      method: 'GET',
      path: '/users/:id',
      pathParams: {} as { id: string },
      response: {} as UserResponse
    } as ApiEndpoint<void, UserResponse, { id: string }>,

    resetPassword: {
      method: 'POST',
      path: '/auth/reset-password',
      request: {} as { email: string },
      response: {} as { message: string }
    } as ApiEndpoint<{ email: string }, { message: string }>
  }
} as const;

export type ApiDomain = keyof typeof apiEndpoints;
export type ApiEndpointKey<T extends ApiDomain> = keyof typeof apiEndpoints[T];
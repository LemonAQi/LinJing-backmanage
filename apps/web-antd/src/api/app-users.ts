import { requestClient } from '#/api/request';

export namespace AppUserApi {
  export interface AppUser {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
    last_login_at?: null | string;
    login_source?: null | string;
    login_count: number;
  }

  export interface AppUserList {
    backendOffline?: boolean;
    items: AppUser[];
    total: number;
  }
}

export function getAppUserList(params: {
  keyword?: string;
  page?: number;
  pageSize?: number;
}) {
  return requestClient.get<AppUserApi.AppUserList>('/admin/app-users', {
    params,
  });
}

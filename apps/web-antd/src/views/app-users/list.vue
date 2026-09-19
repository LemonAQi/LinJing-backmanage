<script lang="ts" setup>
import type { TableColumnsType, TablePaginationConfig } from 'ant-design-vue';

import type { AppUserApi } from '#/api/app-users';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Alert, Button, Card, Input, Space, Table, Tag } from 'ant-design-vue';

import { getAppUserList } from '#/api/app-users';

const loading = ref(false);
const keyword = ref('');
const dataSource = ref<AppUserApi.AppUser[]>([]);
const backendOffline = ref(false);
const loadError = ref('');
const pagination = reactive({
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  total: 0,
});

const columns: TableColumnsType<AppUserApi.AppUser> = [
  {
    dataIndex: 'id',
    title: 'ID',
    width: 80,
  },
  {
    dataIndex: 'nickname',
    title: '姓名',
  },
  {
    dataIndex: 'username',
    title: '用户名',
  },
  {
    dataIndex: 'login_source',
    title: '来源',
    width: 120,
  },
  {
    dataIndex: 'login_count',
    title: '登录次数',
    width: 120,
  },
  {
    dataIndex: 'last_login_at',
    title: '最近登录',
  },
];

const statusDescription = computed(() => {
  if (loadError.value) {
    return loadError.value;
  }
  if (backendOffline.value) {
    return '还没有连上林鲸后端。请先启动 linjing-backend，再刷新本页。';
  }
  return '这里列出从林鲸前端（当前是浏览器 pnpm dev）登录过的人员。后台账号登录仍走 Vben 演示账号。';
});

function sourceLabel(source?: null | string) {
  if (source === 'app') {
    return 'App';
  }
  return 'Web';
}

async function fetchList() {
  loading.value = true;
  loadError.value = '';
  backendOffline.value = false;
  try {
    const data = await getAppUserList({
      keyword: keyword.value.trim(),
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
    dataSource.value = data.items ?? [];
    pagination.total = data.total ?? 0;
    backendOffline.value = Boolean(data.backendOffline);
  } catch (error) {
    dataSource.value = [];
    pagination.total = 0;
    loadError.value =
      error instanceof Error
        ? error.message
        : '无法加载 App 用户列表，请稍后重试。';
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  pagination.current = 1;
  void fetchList();
}

function onTableChange(next: TablePaginationConfig) {
  pagination.current = next.current ?? 1;
  pagination.pageSize = next.pageSize ?? pagination.pageSize;
  void fetchList();
}

onMounted(() => {
  void fetchList();
});
</script>

<template>
  <Page :description="statusDescription" title="App 用户">
    <Alert
      v-if="backendOffline || loadError"
      class="mb-4"
      show-icon
      type="warning"
    >
      <template #message>
        启动林鲸后端后即可看到登录人员
      </template>
      <template #description>
        <div>
          在 `linjing-backend` 目录执行：
        </div>
        <code>
          python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
        </code>
        <div class="mt-2">
          然后在浏览器打开 linjing-uni（pnpm dev），用 alex / 123456 登录，再点刷新。
        </div>
      </template>
    </Alert>
    <Card>
      <Space class="mb-4" wrap>
        <Input
          v-model:value="keyword"
          allow-clear
          placeholder="搜索用户名或姓名"
          style="width: 240px"
          @press-enter="onSearch"
        />
        <Button type="primary" @click="onSearch">查询</Button>
        <Button @click="fetchList">刷新</Button>
      </Space>
      <Table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'login_source'">
            <Tag color="processing">{{ sourceLabel(record.login_source) }}</Tag>
          </template>
          <template v-else-if="column.dataIndex === 'last_login_at'">
            {{ record.last_login_at || '-' }}
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>

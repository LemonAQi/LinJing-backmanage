<script lang="ts" setup>
import type { TableColumnsType, TablePaginationConfig } from 'ant-design-vue';

import type { AppUserApi } from '#/api/app-users';

import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Input, Space, Table, Tag, message } from 'ant-design-vue';

import { getAppUserList } from '#/api/app-users';

const loading = ref(false);
const keyword = ref('');
const dataSource = ref<AppUserApi.AppUser[]>([]);
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

async function fetchList() {
  loading.value = true;
  try {
    const data = await getAppUserList({
      keyword: keyword.value.trim(),
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
    dataSource.value = data.items ?? [];
    pagination.total = data.total ?? 0;
  } catch {
    dataSource.value = [];
    pagination.total = 0;
    message.error(
      '无法加载 Uni 登录用户。请确认 linjing-backend 已在 127.0.0.1:8000 运行。',
    );
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
  <Page
    description="这里列出从林鲸 uni-app 成功登录过的人员。后台账号登录仍走 Vben 演示账号。"
    title="Uni 登录用户"
  >
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
            <Tag color="processing">{{ record.login_source || 'uni' }}</Tag>
          </template>
          <template v-else-if="column.dataIndex === 'last_login_at'">
            {{ record.last_login_at || '-' }}
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>

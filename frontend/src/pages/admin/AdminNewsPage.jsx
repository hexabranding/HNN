import React from 'react';
import NewsManagementView from '../../components/portal/NewsManagementView';

export default function AdminNewsPage({ defaultEditor = false }) {
  return <NewsManagementView mode="admin" defaultEditor={defaultEditor} />;
}

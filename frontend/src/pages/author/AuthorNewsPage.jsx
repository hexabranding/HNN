import React from 'react';
import NewsManagementView from '../../components/portal/NewsManagementView';

export default function AuthorNewsPage({ defaultEditor = false }) {
  return <NewsManagementView mode="author" defaultEditor={defaultEditor} />;
}

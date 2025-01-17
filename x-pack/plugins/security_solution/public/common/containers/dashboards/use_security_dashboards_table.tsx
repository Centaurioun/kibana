/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import type { MouseEventHandler } from 'react';
import type { EuiBasicTableColumn } from '@elastic/eui';
import { getSecurityDashboards } from './utils';
import { LinkAnchor } from '../../components/links';
import { useKibana, useNavigateTo } from '../../lib/kibana';
import * as i18n from './translations';
import { useFetch, REQUEST_NAMES } from '../../hooks/use_fetch';
import { METRIC_TYPE, TELEMETRY_EVENT, track } from '../../lib/telemetry';
import { SecurityPageName } from '../../../../common/constants';
import { useGetSecuritySolutionUrl } from '../../components/link_to';

import type { DashboardTableItem } from './types';

const EMPTY_DESCRIPTION = '-' as const;

export const useSecurityDashboardsTableItems = () => {
  const { http } = useKibana().services;

  const { fetch, data, isLoading, error } = useFetch(
    REQUEST_NAMES.SECURITY_DASHBOARDS,
    getSecurityDashboards
  );

  useEffect(() => {
    if (http) {
      fetch(http);
    }
  }, [fetch, http]);

  const items = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((securityDashboard) => ({
      ...securityDashboard,
      title: securityDashboard.attributes.title?.toString() ?? undefined,
      description: securityDashboard.attributes.description?.toString() ?? undefined,
    }));
  }, [data]);

  return { items, isLoading, error };
};

export const useSecurityDashboardsTableColumns = (): Array<
  EuiBasicTableColumn<DashboardTableItem>
> => {
  const { savedObjectsTagging } = useKibana().services;
  const { navigateTo } = useNavigateTo();
  const getSecuritySolutionUrl = useGetSecuritySolutionUrl();

  const getNavigationHandler = useCallback(
    (href: string): MouseEventHandler =>
      (ev) => {
        ev.preventDefault();
        track(METRIC_TYPE.CLICK, TELEMETRY_EVENT.DASHBOARD);
        navigateTo({ url: href });
      },
    [navigateTo]
  );

  const columns = useMemo(
    (): Array<EuiBasicTableColumn<DashboardTableItem>> => [
      {
        field: 'title',
        name: i18n.DASHBOARD_TITLE,
        sortable: true,
        render: (title: string, { id }) => {
          const href = `${getSecuritySolutionUrl({
            deepLinkId: SecurityPageName.dashboards,
            path: id,
          })}`;
          return href ? (
            <LinkAnchor href={href} onClick={getNavigationHandler(href)}>
              {title}
            </LinkAnchor>
          ) : (
            title
          );
        },
        'data-test-subj': 'dashboardTableTitleCell',
      },
      {
        field: 'description',
        name: i18n.DASHBOARDS_DESCRIPTION,
        sortable: true,
        render: (description: string) => description || EMPTY_DESCRIPTION,
        'data-test-subj': 'dashboardTableDescriptionCell',
      },
      // adds the tags table column based on the saved object items
      ...(savedObjectsTagging ? [savedObjectsTagging.ui.getTableColumnDefinition()] : []),
    ],
    [savedObjectsTagging, getSecuritySolutionUrl, getNavigationHandler]
  );

  return columns;
};

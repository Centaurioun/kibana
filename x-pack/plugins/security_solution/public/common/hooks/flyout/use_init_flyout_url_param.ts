/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useCallback, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { TableId } from '../../../../common/types';
import { useInitializeUrlParam } from '../../utils/global_query_string';
import { URL_PARAM_KEY } from '../use_url_state';
import type { FlyoutUrlState } from './types';
import { dataTableActions, dataTableSelectors } from '../../store/data_table';
import { useShallowEqualSelector } from '../use_selector';
import { tableDefaults } from '../../store/data_table/defaults';

export const useInitFlyoutFromUrlParam = () => {
  const [urlDetails, setUrlDetails] = useState<FlyoutUrlState | null>(null);
  const [hasLoadedUrlDetails, updateHasLoadedUrlDetails] = useState(false);
  const dispatch = useDispatch();
  const getDataTable = dataTableSelectors.getTableByIdSelector();

  // Only allow the alerts page for now to be saved in the url state.
  // Allowing only one makes the transition to the expanded flyout much easier as well
  const dataTableCurrent = useShallowEqualSelector(
    (state) => getDataTable(state, TableId.alertsOnAlertsPage) ?? tableDefaults
  );

  const onInitialize = useCallback((initialState: FlyoutUrlState | null) => {
    if (initialState != null && initialState.panelView) {
      setUrlDetails(initialState);
    }
  }, []);

  const loadExpandedDetailFromUrl = useCallback(() => {
    const { initialized, isLoading, totalCount } = dataTableCurrent;
    const isTableLoaded = initialized && !isLoading && totalCount > 0;
    if (urlDetails && isTableLoaded) {
      updateHasLoadedUrlDetails(true);
      dispatch(
        dataTableActions.toggleDetailPanel({
          id: TableId.alertsOnAlertsPage,
          ...urlDetails,
        })
      );
    }
  }, [dataTableCurrent, dispatch, urlDetails]);

  // The alert page creates a default dataTable slice in redux initially that is later overriden when data is retrieved
  // We use the below to store the urlDetails on app load, and then set it when the table is done loading and has data
  useEffect(() => {
    if (!hasLoadedUrlDetails) {
      loadExpandedDetailFromUrl();
    }
  }, [hasLoadedUrlDetails, loadExpandedDetailFromUrl]);

  useInitializeUrlParam(URL_PARAM_KEY.eventFlyout, onInitialize);
};

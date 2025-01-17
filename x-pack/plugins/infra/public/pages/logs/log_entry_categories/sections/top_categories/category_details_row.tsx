/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect } from 'react';
import { PersistedLogViewReference } from '../../../../../../common/log_views';
import { useLogEntryCategoryExamples } from '../../use_log_entry_category_examples';
import { LogEntryExampleMessages } from '../../../../../components/logging/log_entry_examples/log_entry_examples';
import { TimeRange } from '../../../../../../common/time/time_range';
import { CategoryExampleMessage } from './category_example_message';

const exampleCount = 5;

export const CategoryDetailsRow: React.FunctionComponent<{
  categoryId: number;
  timeRange: TimeRange;
  logViewReference: PersistedLogViewReference;
}> = ({ categoryId, timeRange, logViewReference }) => {
  const {
    getLogEntryCategoryExamples,
    hasFailedLoadingLogEntryCategoryExamples,
    isLoadingLogEntryCategoryExamples,
    logEntryCategoryExamples,
  } = useLogEntryCategoryExamples({
    categoryId,
    endTime: timeRange.endTime,
    exampleCount,
    logViewReference,
    startTime: timeRange.startTime,
  });

  useEffect(() => {
    getLogEntryCategoryExamples();
  }, [getLogEntryCategoryExamples]);

  return (
    <LogEntryExampleMessages
      isLoading={isLoadingLogEntryCategoryExamples}
      hasFailedLoading={hasFailedLoadingLogEntryCategoryExamples}
      hasResults={logEntryCategoryExamples.length > 0}
      exampleCount={exampleCount}
      onReload={getLogEntryCategoryExamples}
    >
      {logEntryCategoryExamples.map((example, exampleIndex) => (
        <CategoryExampleMessage
          key={exampleIndex}
          id={example.id}
          dataset={example.dataset}
          message={example.message}
          timeRange={timeRange}
          timestamp={example.timestamp}
          tiebreaker={example.tiebreaker}
          context={example.context}
        />
      ))}
    </LogEntryExampleMessages>
  );
};

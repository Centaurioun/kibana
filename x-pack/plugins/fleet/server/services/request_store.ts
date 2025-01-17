/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { AsyncLocalStorage } from 'async_hooks';

import type { KibanaRequest } from '@kbn/core-http-server';

export function getRequestStore() {
  const requestStore = new AsyncLocalStorage<KibanaRequest>();

  return requestStore;
}

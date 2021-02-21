/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { configApiRef, discoveryApiRef } from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { createDevApp } from '@backstage/dev-utils';
import { techdocsPlugin } from '../src/plugin';
import { TechDocsDevStorageApi, CatalogDevApi, TechDocsDevApi } from './api';
import { techdocsStorageApiRef, techdocsApiRef, TechdocsPage } from '../src';

createDevApp()
  .registerApi({
    api: techdocsStorageApiRef,
    deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
    factory: ({ configApi, discoveryApi }) =>
      new TechDocsDevStorageApi({
        configApi,
        discoveryApi,
      }),
  })
  .registerApi({
    api: techdocsApiRef,
    deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
    factory: ({ configApi, discoveryApi }) =>
      new TechDocsDevApi({
        configApi,
        discoveryApi,
      }),
  })
  .registerApi({
    api: catalogApiRef,
    deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
    factory: ({ configApi, discoveryApi }) =>
      new CatalogDevApi({
        configApi,
        discoveryApi,
      }),
  })
  .registerPlugin(techdocsPlugin)
  .addPage({
    title: 'Demo Docs',
    element: <TechdocsPage />,
  })
  .render();

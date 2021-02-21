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
import { DiscoveryApi } from '@backstage/core';
import { Config } from '@backstage/config';
import { ComponentEntity, Entity, EntityName, Location } from '@backstage/catalog-model';
import { TechDocsStorage, TechDocs } from '../src/api';
import { CatalogApi } from '@backstage/plugin-catalog-react';
import { CatalogEntitiesRequest, CatalogListResponse, AddLocationRequest, AddLocationResponse } from '@backstage/catalog-client';
import { CatalogRequestOptions } from '@backstage/catalog-client/src/types';
import { TechDocsMetadata } from '../src/types';
import { index } from "./mockDocs";

const exampleEntity: ComponentEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'dev',
    description: 'This is an example of a documented service',
    annotations: {
      'backstage.io/techdocs-ref': 'url:https://example.com/docs',
    }
  },
  spec: {
    type: 'service',
    lifecycle: 'experimental',
    owner: 'team-a',
  }
};

export class TechDocsDevStorageApi implements TechDocsStorage {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;

  constructor({
    configApi,
    discoveryApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
  }

  async getApiOrigin() {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  async getEntityDocs(_entityId: EntityName, _path: string) {
    // TODO: this doesn't return the correct path or any css...
    return Promise.resolve(index);
  }

  async getBaseUrl(
    oldBaseUrl: string,
    entityId: EntityName,
    path: string,
  ): Promise<string> {
    const { name } = entityId;
    const apiOrigin = await this.getApiOrigin();
    return new URL(oldBaseUrl, `${apiOrigin}/${name}/${path}`).toString();
  }
}

export class TechDocsDevApi implements TechDocs {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;

  constructor({
    configApi,
    discoveryApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
  }

  async getApiOrigin() {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  getTechDocsMetadata(_entityId: EntityName): Promise<TechDocsMetadata> {
    return Promise.resolve({
      site_name: 'Dev Documentation',
      site_description: 'This is some example documenation',
    })
  }

  getEntityMetadata(_entityId: EntityName): Promise<Entity> {
    return Promise.resolve(exampleEntity);
  }
}


export class CatalogDevApi implements CatalogApi {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;

  constructor({
    configApi,
    discoveryApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
  }

  getLocationById(_id: String, _options?: CatalogRequestOptions): Promise<Location | undefined> {
    throw new Error('Method not implemented.');
  }
  getEntityByName(_name: EntityName, _options?: CatalogRequestOptions): Promise<Entity | undefined> {
    throw new Error('Method not implemented.');
  }
  getEntities(_request?: CatalogEntitiesRequest, _options?: CatalogRequestOptions): Promise<CatalogListResponse<Entity>> {
    return Promise.resolve({items: [exampleEntity]});
  }
  addLocation(_location: AddLocationRequest, _options?: CatalogRequestOptions): Promise<AddLocationResponse> {
    throw new Error('Method not implemented.');
  }
  getLocationByEntity(_entity: Entity, _options?: CatalogRequestOptions): Promise<Location | undefined> {
    throw new Error('Method not implemented.');
  }
  removeEntityByUid(_uid: string, _options?: CatalogRequestOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

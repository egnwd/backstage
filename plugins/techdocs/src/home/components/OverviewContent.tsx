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
import { generatePath } from 'react-router-dom';

import { Entity } from '@backstage/catalog-model';
import {
  Button,
  Content,
  ContentHeader,
  SupportButton,
  ItemCardGrid,
  ItemCardHeader,
} from '@backstage/core';
import { Card, CardActions, CardContent, CardMedia } from '@material-ui/core';

import { rootDocsRouteRef } from '../../plugin';

export const OverviewContent = ({
  entities,
}: {
  entities: Entity[] | undefined;
}) => {
  if (!entities) return null;
  return (
    <Content>
      <ContentHeader
        title="Overview"
        description="Explore your internal technical ecosystem through documentation."
      >
        <SupportButton>Discover documentation in your ecosystem.</SupportButton>
      </ContentHeader>
      <ItemCardGrid data-testid="docs-explore">
        {!entities?.length
          ? null
          : entities.map((entity, index: number) => (
              <Card key={index}>
                <CardMedia>
                  <ItemCardHeader title={entity.metadata.name} />
                </CardMedia>
                <CardContent>{entity.metadata.description}</CardContent>
                <CardActions>
                  <Button
                    to={generatePath(rootDocsRouteRef.path, {
                      namespace: entity.metadata.namespace ?? 'default',
                      kind: entity.kind,
                      name: entity.metadata.name,
                    })}
                    color="primary"
                  >
                    Read Docs
                  </Button>
                </CardActions>
              </Card>
            ))}
      </ItemCardGrid>
    </Content>
  );
};

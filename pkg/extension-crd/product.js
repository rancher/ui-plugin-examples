import { STEVE_AGE_COL, STEVE_NAME_COL, STEVE_NAMESPACE_COL, STEVE_STATE_COL } from '@rancher/shell/config/pagination-table-headers';
import { STATE, NAME as NAME_COL, AGE } from '@shell/config/table-headers';
import { UI_PLUGIN } from '@shell/config/types';

export const EXPLORER = 'explorer';

export function init(plugin, store) {
  const {
    basicType,
    headers,
    mapGroup,
  } = plugin.DSL(store, EXPLORER);

  mapGroup('plugins', 'Extensions');

  basicType([
    UI_PLUGIN,
  ], 'plugins');

  headers(UI_PLUGIN,
  // Columns to show when server-side pagination is DISABLED
  [
    STATE,
    NAME_COL,
    {
      name:     'version',
      label:    'Version',
      getValue: row => row.version, // This is a locally computed property via a getter on the resource's model in rancher/dashboard shell/models/catalog.cattle.io.uiplugin.js
      sort:     'version',
      search:   'version',
    },
    {
      name:     'cacheState',
      label:    'Cache State',
      getValue: row => row.status?.cacheState,
      sort:     'status.cacheState',
      search:   'status.cacheState',
    },
    AGE,
  ],
  // Columns to show when server-side pagination is ENABLED
  // Note - these provide paths to properties that...
  // 1. Exist in the resource itself and are not calculated locally in a resource model in the browser
  // 2. The properties have been indexed
  [
    STEVE_STATE_COL,
    STEVE_NAME_COL,
    STEVE_NAMESPACE_COL,
    {
      name:   'version',
      label:  'Version',
      value:  'metadata.fields.2', // metadata.fields are automatically indexed
      sort:   false, // should be 'metadata.fields.2', but currently broken https://github.com/rancher/rancher/issues/52121
      search: false, // should be 'metadata.fields.2', but currently broken https://github.com/rancher/rancher/issues/52121
    },
    {
      name:   'cacheState',
      label:  'Cache State',
      value:  'metadata.fields.3', // metadata.fields are automatically indexed
      sort:   false, // should be 'metadata.fields.2', but currently broken https://github.com/rancher/rancher/issues/52121
      search: false, // should be 'metadata.fields.2', but currently broken https://github.com/rancher/rancher/issues/52121
    },
    STEVE_AGE_COL,
  ]);
}

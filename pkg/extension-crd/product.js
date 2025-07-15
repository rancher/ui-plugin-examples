import { STATE, NAME as NAME_COL, AGE } from '@shell/config/table-headers';

export const EXPLORER = 'explorer';

export function init(plugin, store) {
  const {
    basicType,
    headers,
    mapGroup,
  } = plugin.DSL(store, EXPLORER);

  const UI_PLUGIN = 'catalog.cattle.io.uiplugin';

  mapGroup('plugins', 'Extensions');

  basicType([
    UI_PLUGIN,
  ], 'plugins');

  headers(UI_PLUGIN, [
    STATE,
    NAME_COL,
    {
      name:     'version',
      label:    'Version',
      value:    'version',
      getValue: row => row.version
    },
    {
      name:     'cacheState',
      label:    'Cache State',
      value:    'status.cacheState',
      getValue: row => row.status?.cacheState
    },
    AGE,
  ]);
}

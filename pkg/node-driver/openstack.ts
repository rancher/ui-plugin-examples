/**
 * Helper class for dealing with the Openstack API
 */
export class Openstack {
  public domainName: string = '';
  public endpoint: string = '';
  public projectDomainName: string = '';
  public projectId: string = '';
  public projectName: string = '';
  public username: string = '';
  public password: string = '';
  public token: string = '';
  private catalog: any;
  private endpoints: any;
  // private region: string = '';

  private $dispatch: any;

  constructor($store: any, obj: any) {
    if (obj.annotations) {
      Object.keys(obj.annotations).forEach((key) => {
        const p = key.split('/');

        if (p.length === 2 && p[0] === 'openstack.cattle.io') {
          const field = p[1];

          (this as any)[field] = obj.annotations[key];
        }
      });
    }

    this.$dispatch = $store.dispatch;
  }

  public async getToken() {
    const endpoint = this.endpoint.replace(/^https?:\/\//, '');
    const baseUrl = `/meta/proxy/${ endpoint }`;
    const url = `${ baseUrl }/auth/tokens`;

    const data = {
      auth: {
        identity: {
          methods:  ['password'],
          password: {
            user: {
              name:     this.username,
              domain:   { name: this.domainName },
              password: this.password
            }
          }
        },
        scope: {
          project: {
            name:   this.projectName,
            domain: { name: this.projectDomainName }
          }
        }
      }
    };

    const headers = { Accept: 'application/json' };

    try {
      const res = await this.$dispatch('management/request', {
        url,
        headers,
        method:               'POST',
        redirectUnauthorized: false,
        data
      }, { root: true });

      const token = res._headers['x-subject-token'];

      this.token = token;

      if (res?.token) {
        this.catalog = res.token.catalog;
        this.endpoints = {};
        this.catalog.forEach((service: any) => {
          const iface = service.endpoints.find((svc: any) => svc.interface === 'public');

          if (iface) {
            this.endpoints[service.type] = iface.url;

            // if (service.importTypes === 'compute') {
            //   this.region = iface.region;
            // }
          }
        });
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }

  public async getFlavors(value: any, initial?: string) {
    return await this.getOptions(value, '/flavors', 'flavors', undefined, initial);
  }

  public async getImages(value: any, initial?: string) {
    return await this.getOptions(value, '/images/detail', 'images', undefined, initial);
  }

  public async getKeyPairs(value: any, initial?: string) {
    return await this.getOptions(value, '/os-keypairs', 'keypairs', (v: any) => v.keypair, initial);
  }

  public async getSecurityGroups(value: any, initial?: string) {
    return await this.getOptions(value, '/os-security-groups', 'security_groups', undefined, initial);
  }

  public async getFloatingIpPools(value: any, initial?: string) {
    return await this.getOptions(value, '/os-floating-ip-pools', 'floating_ip_pools', undefined, initial);
  }

  public async getNetworkNames(value: any, initial?: string) {
    return await this.getOptions(value, '/os-tenant-networks', 'networks', (network: any) => {
      return {
        ...network,
        name: network.label
      };
    }, initial);
  }

  public async getAvailabilityZones(value: any, initial?: string) {
    return await this.getOptions(value, '/os-availability-zone', 'availabilityZoneInfo', (zone: any) => {
      return {
        ...zone,
        name: zone.zoneName
      };
    }, initial);
  }

  public async getOptions(value: any, api: string, field: string, mapper?: Function, initial?: string) {
    // We are fetching the data for the options
    value.busy = true;
    value.enabled = true;
    value.selected = '';

    const res = await this.makeComputeRequest(api);

    if (res && (res as any)[field]) {
      let list = (res as any)[field] || [];

      if (mapper) {
        list = list.map((k: any) => mapper(k));
      }

      value.options = this.convertToOptions(list);
      value.busy = false;

      if (initial) {
        const found = value.options.find((option: any) => option.value.name === initial);

        if (found) {
          value.selected = found.value;
        }
      }

      if (!value.selected && value.options.length > 0) {
        value.selected = value.options[0].value;
      }
    } else {
      value.options = [];
      value.selected = null;
      value.busy = false;
      value.enabled = false;
    }
  }

  public async makeComputeRequest(api: string) {
    const endpoint = this.endpoints['compute'].replace(/^https?:\/\//, '');
    const baseUrl = `/meta/proxy/${ endpoint }`;
    const url = `${ baseUrl }${ api }`;

    const headers = {
      Accept:         'application/json',
      'X-Auth-Token': this.token
    };

    try {
      const res = await this.$dispatch('management/request', {
        url,
        headers,
        method:               'GET',
        redirectUnauthorized: false,
      }, { root: true });

      return res;
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }

  private convertToOptions(list: any) {
    const sorted = (list || []).sort((a: any, b: any) => a.name.localeCompare(b.name));

    return sorted.map((p: any) => {
      return {
        label: p.name,
        value: p
      };
    });
  }
}

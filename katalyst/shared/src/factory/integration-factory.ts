import { KatalystIntegration } from '../types';
import { TanStackIntegration } from '../integrations/tanstack';
import { RSpackIntegration } from '../integrations/rspack';
import { EMPIntegration } from '../integrations/emp';
import { EsmxIntegration } from '../integrations/esmx';
import { ParetoIntegration } from '../integrations/pareto';
import { RePackIntegration } from '../integrations/repack';
import { UmiIntegration } from '../integrations/umi';
import { RspeedyIntegration } from '../integrations/rspeedy';
import { ElectronIntegration } from '../integrations/electron';
import { NxIntegration } from '../integrations/nx';
import { ArcoIntegration } from '../integrations/arco';
import { CosmosIntegration } from '../integrations/cosmos';
import { StyleXIntegration } from '../integrations/stylex';
import { ZephyrIntegration } from '../integrations/zephyr';
import { VirtualModulesIntegration } from '../integrations/virtual-modules';
import { AssetManifestIntegration } from '../integrations/asset-manifest';
import { FastRefreshIntegration } from '../integrations/fast-refresh';
import { TypiaIntegration } from '../integrations/typia';
import { StorybookIntegration } from '../integrations/storybook';
import { NgrokIntegration } from '../integrations/ngrok';
import { InspectorIntegration } from '../integrations/inspector';
import { SvgrIntegration } from '../integrations/svgr';
import { SailsIntegration } from '../integrations/sails';
import { TapableIntegration } from '../integrations/tapable';
import { MidsceneIntegration } from '../integrations/midscene';
import { integrationConfigs } from '../config/integrations.config';

export class IntegrationFactory {
  private static integrations = new Map<string, any>();

  static createIntegration(integration: KatalystIntegration) {
    const config = integrationConfigs[integration.name as keyof typeof integrationConfigs] || {};
    
    switch (integration.name) {
      case 'tanstack':
        return new TanStackIntegration(config);
      case 'rspack':
        return new RSpackIntegration(config);
      case 'emp':
        return new EMPIntegration(config);
      case 'esmx':
        return new EsmxIntegration(config);
      case 'pareto':
        return new ParetoIntegration(config);
      case 'repack':
        return new RePackIntegration(config);
      case 'umi':
        return new UmiIntegration(config);
      case 'rspeedy':
        return new RspeedyIntegration(config);
      case 'electron':
        return new ElectronIntegration(config);
      case 'nx':
        return new NxIntegration(config);
      case 'arco':
        return new ArcoIntegration(config);
      case 'cosmos':
        return new CosmosIntegration(config);
      case 'stylex':
        return new StyleXIntegration(config);
      case 'zephyr':
        return new ZephyrIntegration(config);
      case 'virtual-modules':
        return new VirtualModulesIntegration(config);
      case 'asset-manifest':
        return new AssetManifestIntegration(config);
      case 'fast-refresh':
        return new FastRefreshIntegration(config);
      case 'typia':
        return new TypiaIntegration(config);
      case 'storybook':
        return new StorybookIntegration(config);
      case 'ngrok':
        return new NgrokIntegration(config);
      case 'inspector':
        return new InspectorIntegration(config);
      case 'svgr':
        return new SvgrIntegration(config);
      case 'sails':
        return new SailsIntegration(config);
      case 'tapable':
        return new TapableIntegration(config);
      case 'midscene':
        return new MidsceneIntegration(config);
      default:
        throw new Error(`Unknown integration: ${integration.name}`);
    }
  }

  static async initializeIntegrations(integrations: KatalystIntegration[]) {
    const results = [];
    
    for (const integration of integrations) {
      if (integration.enabled) {
        try {
          const instance = this.createIntegration(integration);
          const initialized = await instance.initialize();
          results.push(...initialized);
          this.integrations.set(integration.name, instance);
        } catch (error) {
          console.error(`Failed to initialize ${integration.name}:`, error);
        }
      }
    }
    
    return results;
  }

  static getIntegration(name: string) {
    return this.integrations.get(name);
  }

  static getAllIntegrations() {
    return Array.from(this.integrations.values());
  }
}

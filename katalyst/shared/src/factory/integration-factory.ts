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
        return new TanStackIntegration(config as any);
      case 'rspack':
        return new RSpackIntegration(config as any);
      case 'emp':
        return new EMPIntegration(config as any);
      case 'esmx':
        return new EsmxIntegration(config as any);
      case 'pareto':
        return new ParetoIntegration(config as any);
      case 'repack':
        return new RePackIntegration(config as any);
      case 'umi':
        return new UmiIntegration(config as any);
      case 'rspeedy':
        return new RspeedyIntegration(config as any);
      case 'electron':
        return new ElectronIntegration(config as any);
      case 'nx':
        return new NxIntegration(config as any);
      case 'arco':
        return new ArcoIntegration(config as any);
      case 'cosmos':
        return new CosmosIntegration(config as any);
      case 'stylex':
        return new StyleXIntegration(config as any);
      case 'zephyr':
        return new ZephyrIntegration(config as any);
      case 'virtual-modules':
        return new VirtualModulesIntegration(config as any);
      case 'asset-manifest':
        return new AssetManifestIntegration(config as any);
      case 'fast-refresh':
        return new FastRefreshIntegration(config as any);
      case 'typia':
        return new TypiaIntegration(config as any);
      case 'storybook':
        return new StorybookIntegration(config as any);
      case 'ngrok':
        return new NgrokIntegration(config as any);
      case 'inspector':
        return new InspectorIntegration(config as any);
      case 'svgr':
        return new SvgrIntegration(config as any);
      case 'sails':
        return new SailsIntegration(config as any);
      case 'tapable':
        return new TapableIntegration(config as any);
      case 'midscene':
        return new MidsceneIntegration(config as any);
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
          const initialized = await (instance as any).initialize();
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

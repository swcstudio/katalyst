// ========================================
// 🚀 NEW UNIFIED HOOK ARCHITECTURE
// ========================================

// Master Runtime Hook - Single interface for all runtime operations
export { useKatalystRuntime, type KatalystRuntimeConfig } from './use-katalyst-runtime.ts';

// Advanced Multithreading Hooks (@swcstudio/multithreading) - Enhanced with AI integration
export * from './use-multithreading.ts';
export {
  useAdvancedMultithreading,
  useAITaskProcessor,
  useThreadMonitoring,
  useBatchProcessor,
  useSubagentCoordination,
  useParallelComputation,
  useAsyncComputation,
  type AdvancedThreadTask,
  type AdvancedTaskResult,
  type ThreadPoolMetrics,
  type SystemMetrics,
  type ThreadLifecycleConfig,
} from './use-multithreading.ts';

// ========================================
// 🔄 LEGACY COMPATIBILITY LAYER
// ========================================

// Core hooks (individual - for backward compatibility)
export * from './use-config.ts';
export * from './use-emp.ts';
export * from './use-hydration.ts';
export * from './use-integration.ts';
export * from './use-katalyst.ts';

// Individual runtime hooks (legacy - consider using useKatalystRuntime)
export * from './use-rspack.ts';
export * from './use-sails.ts';
export * from './use-inspector.ts';
export * from './use-server-actions.ts';
export * from './use-unified-builder.ts';
export * from './use-zephyr.ts';
export * from './use-umi.ts';
export * from './use-rspeedy.ts';
export * from './use-arco.ts';
export * from './use-trpc.ts';

// ========================================
// 📦 HOOK MIGRATION GUIDE
// ========================================

/**
 * MIGRATION FROM INDIVIDUAL HOOKS TO UNIFIED RUNTIME:
 * 
 * OLD APPROACH (multiple hooks):
 * ```tsx
 * const emp = useEMP();
 * const umi = useUmi();
 * const multithreading = useMultithreading();
 * const rspack = useRspack();
 * ```
 * 
 * NEW APPROACH (single hook):
 * ```tsx
 * const runtime = useKatalystRuntime({
 *   preferredProviders: ['emp', 'umi', 'rspack'],
 *   multithreadingEnabled: true,
 *   aiProcessingEnabled: true,
 * });
 * 
 * // Execute with automatic failover
 * const result = await runtime.executeWithProvider('emp', 'bundleCode', data, {
 *   fallbackProviders: ['rspack'],
 *   useMultithreading: true,
 *   priority: 'high'
 * });
 * 
 * // Batch processing
 * const batchResults = await runtime.executeBatch([
 *   { provider: 'emp', operation: 'bundle', data: empData },
 *   { provider: 'umi', operation: 'build', data: umiData },
 * ]);
 * 
 * // AI-powered processing
 * const aiResult = await runtime.processAITask('inference', modelData, {
 *   provider: 'typia',
 *   priority: 'critical'
 * });
 * ```
 * 
 * BENEFITS:
 * - 90% reduction in hook usage complexity
 * - Automatic failover between providers
 * - Intelligent load balancing with multithreading
 * - Cross-provider task coordination
 * - Built-in performance monitoring
 * - AI-powered task processing
 */

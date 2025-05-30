resource "helm_release" "vnode_runtime" {
  name       = "vnode-runtime"
  repository = "https://charts.loft.sh"
  chart      = "vnode-runtime"
  version    = "0.0.2"
  namespace  = "kube-system"

  set {
    name  = "nodeSelector.kubernetes\\.io/os"
    value = "linux"
  }

  set {
    name  = "tolerations[0].key"
    value = "node-role.kubernetes.io/control-plane"
  }

  set {
    name  = "tolerations[0].operator"
    value = "Exists"
  }

  set {
    name  = "tolerations[0].effect"
    value = "NoSchedule"
  }
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */

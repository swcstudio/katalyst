# Deployment Guide for SOTA Marketing Stack

This guide explains how to deploy the SOTA Marketing Stack to various environments, including local development, staging, and production.

## Prerequisites

Before deploying, ensure you have the following tools installed:

- Deno v1.32 or later
- kubectl
- vCluster CLI
- OVHcloud CLI (for OVHcloud deployment)
- Netlify CLI (for Netlify deployment)

## Local Development Deployment

### 1. Start the Development Server

```bash
deno task dev
```

This will start the development server at http://localhost:3000.

### 2. Build for Production

```bash
deno task build
```

This will create a production build in the `dist` directory.

### 3. Preview Production Build

```bash
deno task preview
```

This will serve the production build at http://localhost:3000.

## Kubernetes Deployment

### 1. Create a Kubernetes Cluster on OVHcloud

1. Log in to your OVHcloud account
2. Navigate to the Kubernetes service
3. Create a new managed Kubernetes cluster
4. Download the kubeconfig file

```bash
export KUBECONFIG=/path/to/your/kubeconfig.yaml
```

### 2. Configure kubectl

```bash
kubectl config use-context your-ovh-context
kubectl cluster-info
```

### 3. Create a Namespace

```bash
kubectl create namespace sota-marketing
```

### 4. Deploy the Application

```bash
kubectl apply -f k8s/
```

### 5. Create a vCluster

```bash
vcluster create sota-marketing -n sota-marketing
```

### 6. Connect to the vCluster

```bash
vcluster connect sota-marketing -n sota-marketing
```

### 7. Deploy CloudNativePG

```bash
kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.18/releases/cnpg-1.18.0.yaml
```

### 8. Deploy the Database

```bash
kubectl apply -f k8s/database.yaml
```

### 9. Deploy Convex

```bash
kubectl apply -f k8s/convex.yaml
```

### 10. Check Deployment Status

```bash
kubectl get pods -n sota-marketing
kubectl get services -n sota-marketing
kubectl get ingress -n sota-marketing
```

## Netlify Deployment

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Login to Netlify

```bash
netlify login
```

### 3. Initialize Netlify Site

```bash
netlify init
```

### 4. Deploy to Netlify

```bash
deno task build
netlify deploy --prod
```

## CI/CD Pipeline

The SOTA Marketing Stack includes a CI/CD pipeline using GitHub Actions. When you push changes to the repository, the pipeline will automatically:

1. Lint the code
2. Run tests
3. Build the application
4. Deploy to Netlify (for the main branch)

### GitHub Actions Configuration

The CI/CD pipeline is configured in `.github/workflows/ci.yml`. You can customize this file to suit your specific needs.

### Tekton Pipeline

For more advanced CI/CD capabilities, you can use the Tekton pipeline defined in `k8s/tekton/`:

```bash
kubectl apply -f k8s/tekton/
```

### Flux CD for GitOps

The SOTA Marketing Stack also includes Flux CD for GitOps-based deployments:

```bash
kubectl apply -f k8s/flux/
```

## Monitoring and Logging

### 1. Deploy Prometheus and Grafana

```bash
kubectl apply -f k8s/monitoring/
```

### 2. Access Grafana Dashboard

```bash
kubectl port-forward svc/grafana 3000:80 -n monitoring
```

Then open http://localhost:3000 in your browser.

## Troubleshooting

### Common Issues

1. **Pod Pending Status**: Check if there are enough resources in your cluster.
2. **Connection Refused**: Ensure the service is running and the port is correctly exposed.
3. **Database Connection Issues**: Verify the database credentials and connection string.

### Viewing Logs

```bash
kubectl logs deployment/sota-marketing-stack -n sota-marketing
```

### Restarting Deployments

```bash
kubectl rollout restart deployment/sota-marketing-stack -n sota-marketing
```

## Conclusion

You have now successfully deployed the SOTA Marketing Stack to your environment. For more information on customizing and extending the stack, refer to the other documentation files.

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */

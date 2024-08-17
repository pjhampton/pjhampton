---
title: 'ArgoCD Image Updater - GCR Connectivity'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2023-Mar-30'
show_post_footer: true
excerpt: >
  ArgoCD Image Updater - Permissions issue when connecting to Google Cloud Registry
---

ArgoCD is a fantastic piece of software in my opinion. It's a brilliant tool for syncing Kustomize and/or Helm projects, or simple file manifest directories with a Kubernetes cluster. In a recent proof-of-concept project of moving our teams Kafka processor workloads onto Googles Kubernetes Engine (GKE) we made the decision early on to auto-deploy the Kafka Processors once they make it through a series of CI checks - we have a toil and throughput problem so this may seem extreme to some, but we know we can dial it back if required. 

An annoying caveat is ArgoCD doesn't support container image updating natively ([yet](https://github.com/argoproj-labs/argocd-image-updater/issues/491)). At the time of writing this post, my argo / k8s setup configuration looked like so:

```yaml
$ argocd version

argocd: v2.5.7+e0ee345.dirty
  BuildDate: 2023-01-18T04:25:01Z
  GitCommit: e0ee3458d0921ad636c5977d96873d18590ecf1a
  GitTreeState: dirty
  GoVersion: go1.19.5
  Compiler: gc
  Platform: darwin/arm64
argocd-server: v2.6.6+6d4de2e
  BuildDate: 2023-03-16T22:25:45Z
  GitCommit: 6d4de2ec5d49fa2c6823f2b7d101607a839be3fa
  GitTreeState: clean
  GoVersion: go1.18.10
  Compiler: gc
  Platform: linux/amd64
  Kustomize Version: v4.5.7 2022-08-02T16:35:54Z
  Helm Version: v3.10.3+g835b733
  Kubectl Version: v0.24.2
  Jsonnet Version: v0.19.1
```

Until `argocd-image-updater` is merged into ArgoCD ([See this proposal](https://github.com/argoproj/argo-cd/pull/10447#issuecomment-1333839258)) you will need to set it up as documented, however - I ran into a perms issue when connecting it to Google Cloud Registry (GCR). After installing and getting everything set up, we were running into this specific problem 

```python
DEBU[0000] Creating in-cluster Kubernetes client        
INFO[0000] retrieving information about image            image_alias= image_digest= image_name=gcr.io/testtest/k8s-test image_tag=latest registry_url=gcr.io
WARN[0000] Target platform is 'darwin/arm64', but that's not a supported container platform. Forgot --platforms? 
DEBU[0000] setting rate limit to 20 requests per second  prefix=gcr.io registry="https://gcr.io"
DEBU[0000] Inferred registry from prefix gcr.io to use API https://gcr.io 
INFO[0000] Fetching available tags and metadata from registry  application=test image_alias= image_digest= image_name=gcr.io/testtest/k8s-test image_tag=latest registry_url=gcr.io
FATA[0001] could not get tags: denied: Failed to read tags for host 'gcr.io', repository '/v2/testtest/k8s-test/tags/list'  application=test image_alias= image_digest= image_name=gcr.io/testtest/k8s-test image_tag=latest registry_url=gcr.io
```

## How I worked around this limitation

First, create a service account in Google Cloud with the following permissions:

```yaml 
- Storage Admin
- Container Registry Service Agent
```

Then add a key and download in JSON format. It should look something like so:

```json
{
  "type": "service_account",
  "project_id": "testtest",
  "private_key_id": "1111111111111111111111111111111111111111",
  "private_key": "-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@testtest.iam.gserviceaccount.com",
  "client_id": "1111111111111111111",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40testtest.iam.gserviceaccount.com"
}
```

You are then clear to create a secret in your Kubernetes namespace. It should be in this format: `<username>:<password>` where `<username>=_json_key` and the password is the minified jsonpayload. No surrounding quotes required. 

```yaml
apiVersion: v1
kind: Secret
metadata:
  namespace: argocd
  name: image-updater-gcr
type: Opaque
stringData:
  secret: _json_key:{"type":"service_account","project_id":"testtest", ...}
```

Once the secret is applied with:

```sh
$ kubectl apply -f secret.yml -n argocd
```

You can update the ConfigMap for `argocd`

```sh
$ kubectl -n argocd edit cm argocd-image-updater-config
```

With the following configuration

```yaml
apiVersion: v1
kind: ConfigMap
data:
  log.level: debug
  registries.conf: |
    registries:
    - name: Google Container Registry
      prefix: gcr.io
      api_url: https://gcr.io
      default: true
      credentials: secret:argocd/image-updater-gcr#secret
```

To set up your strategy you can add the [following annotations](https://argocd-image-updater.readthedocs.io/en/stable/basics/update-strategies/#strategy-digest) to your Argo application. Below is an example of the daemon process checking the sha digest of the `latest` tagged image. 

```yml
@argocd-image-updater.argoproj.io/image-list: myimg=some/image:latest
@argocd-image-updater.argoproj.io/myimg.update-strategy: digest
```

Hopefully this post saves you a couple of hours, whoever you are.

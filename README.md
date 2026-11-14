# Books

A server-rendered, single-page reading list for people building technology. Book covers are served by [Open Library](https://openlibrary.org/).

Covers are fetched through the server and cached for 24 hours, so browsers can reuse them during automatic reloads. The server-side cache is local to each running instance.

## Local development

With Docker Compose:

```sh
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Source changes are reflected by the development server. To run without Docker, use Node.js 20.9 or newer:

```sh
npm ci
npm run dev
```

## Tests

With Node.js 20.9 or newer:

```sh
npm ci
npm test
```

Or run the tests using Docker Compose:

```sh
docker compose run --rm books npm test
```

## Configuration

These settings are read on the server at request time, so they can be changed when deploying the same image:

| Variable | Default | Description |
| --- | --- | --- |
| `ENABLE_AUTH` | `false` | Set to `true` to show a **non-functional preview** login form. This does not authenticate users or protect the application. |
| `RELOAD_SECONDS` | `5` | Page reload interval in whole seconds. Set to `0` to disable. Invalid values use the default. |
| `AWS_REGION` | unset | Region shown in the footer; takes precedence over `AWS_DEFAULT_REGION`. |
| `AWS_DEFAULT_REGION` | unset | Alternative region setting. |

Compose reads these variables from your shell or a local `.env` file. For example, `ENABLE_AUTH=true RELOAD_SECONDS=0 docker compose up --build` shows the login preview without refreshing it.

If neither region variable is set, the server attempts an IMDSv2 instance identity lookup with short timeouts, caching the result for five minutes. It displays “Not available” when metadata is inaccessible. On EKS, the metadata service may be blocked or describe the worker node rather than the pod; setting `AWS_REGION` explicitly is recommended. No AWS credentials are needed.

The theme chooser currently offers Light. To add another theme, add it to the `themes` list in `app/theme-chooser.js` and define its CSS variables under a matching `data-theme` selector in `app/globals.css`.

## Production image

```sh
docker build -t books .
docker run --rm -p 3000:3000 -e AWS_REGION=us-east-1 books
```

The production image runs the Next.js standalone server as a non-root user.

## Kubernetes health probes

`GET /healthz/live` and `GET /healthz/ready` return an uncached `200 OK` when the server can respond, including when the login preview is enabled. Both are lightweight checks; they do not check page rendering, Open Library, or AWS metadata. For example, add these to the container in a Deployment:

```yaml
ports:
  - name: http
    containerPort: 3000
readinessProbe:
  httpGet:
    path: /healthz/ready
    port: http
  periodSeconds: 5
  timeoutSeconds: 2
  failureThreshold: 3
livenessProbe:
  httpGet:
    path: /healthz/live
    port: http
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 6
```

Adjust thresholds for the deployment. If startup is slow, consider a startup probe as well.

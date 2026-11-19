# Books

A server-rendered, single-page reading list for people building technology. Book covers are served by [Open Library](https://openlibrary.org/).

Covers are fetched through the server and cached for 24 hours, so browsers can reuse them on subsequent visits. The server-side cache is local to each running instance.

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

| Variable      | Default | Description                                                                                                                 |
| ------------- | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| `ENABLE_AUTH` | `false` | Set to `true` to show a **non-functional preview** login form. This does not authenticate users or protect the application. |

Compose reads this variable from your shell or a local `.env` file. For example, `ENABLE_AUTH=true docker compose up --build` shows the login preview.

The theme chooser offers Light and Dark. The selection is stored in a cookie so the server renders the chosen theme on reload. To add another theme, add it to the `themes` list in `lib/themes.js` and define its CSS variables under a matching `data-theme` selector in `app/globals.css`.

## Production image

```sh
docker build -t books .
docker run --rm -p 3000:3000 books
```

The production image runs the Next.js standalone server as a non-root user.

## Kubernetes health probes

`GET /healthz/live` and `GET /healthz/ready` return an uncached `200 OK` when the server can respond, including when the login preview is enabled. Both are lightweight checks; they do not check page rendering or Open Library. For example, add these to the container in a Deployment:

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

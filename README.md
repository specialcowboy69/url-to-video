# URL to Video Frontend

Frontend minimalista para crear videos verticales desde una URL usando n8n como backend.

## Desarrollo

```bash
npm install
npm run dev
```

## Variables

Copia `.env.example` a `.env.local` y ajusta los webhooks internos:

```env
N8N_GENERATE_WEBHOOK_URL=http://n8n:5678/webhook/generate
N8N_STATUS_WEBHOOK_URL=http://n8n:5678/webhook/status
```

El navegador nunca ve estas URLs. Las rutas publicas del frontend son:

```text
POST /api/videos
GET /api/videos/:jobId
```

Contrato de creacion:

```json
{
  "sourceUrl": "https://example.com/noticia",
  "mediaMode": "videos"
}
```

`mediaMode` debe ser `videos` o `images`.

## Docker

El `Dockerfile` usa `next build` con salida `standalone`.

Ejemplo de servicio en el `docker-compose.yml` de `/opt/n8n`:

```yaml
frontend:
  build:
    context: ./frontend-url-video
  environment:
    N8N_GENERATE_WEBHOOK_URL: http://n8n:5678/webhook/generate
    N8N_STATUS_WEBHOOK_URL: http://n8n:5678/webhook/status
  depends_on:
    - n8n
  labels:
    - traefik.enable=true
    - traefik.http.routers.urltovideo-frontend.rule=Host(`app.urltovideo.es`)
    - traefik.http.routers.urltovideo-frontend.entrypoints=websecure
    - traefik.http.routers.urltovideo-frontend.tls.certresolver=letsencrypt
    - traefik.http.services.urltovideo-frontend.loadbalancer.server.port=3000
```

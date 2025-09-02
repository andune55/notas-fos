# Migración de localStorage a backend (Fly.io)

Objetivo: sincronizar listas y notas entre dispositivos usando un backend en Fly.io, manteniendo la UX actual.

## 1) Backend en Fly.io

1. En `server/` están los archivos:
   - `package.json`, `tsconfig.json`
   - `src/db.ts`, `src/index.ts`
   - `Dockerfile`, `fly.toml`

2. Despliegue:
   ```bash
   cd server
   fly launch --no-deploy
   fly volumes create notes_data --size 1 --region mad
   fly secrets set API_KEY=TU_API_KEY
   fly secrets set ORIGIN=https://TU_DOMINIO_FRONTEND
   fly deploy
   ```

3. Salud:
   - `https://<tu-app>.fly.dev/health` -> `{ ok: true }`

## 2) Variables de entorno del frontend (Vite)

Crear `.env` en la raíz del proyecto:
```env
VITE_API_BASE_URL=https://notas-fos-backend.fly.dev
VITE_API_KEY=TU_API_KEY_OPCIONAL
```

## 3) Helper API

Archivo: `src/helpers/api.ts`  
Contiene las funciones REST: listas, notas, reordenación e importación.

## 4) Store migrado

Archivo: `src/store.ts`  
- Mantiene la API pública previa (mismos métodos/props) para no tocar componentes.
- Añade `initFromServer()` para hidratar el estado desde el backend al arrancar.
- Operaciones optimistas + sincronización en segundo plano.

## 5) Arranque de datos

En `src/App.tsx`, al montar:
```ts
const initFromServer = useNotaStore(s => s.initFromServer)
useEffect(() => { initFromServer() }, [initFromServer])
```

## 6) Reordenación

`cambiarOrdenNotas` actualiza el estado y llama a `PUT /lists/:key/notes/reorder` con el orden de `ids`.

## 7) Importar / Exportar

- `importarLista(nombre, notas)` reemplaza todas las notas de una lista usando el endpoint `/import`.
- `GET /export` devuelve toda la estructura (listas + notas) para backups.

## 8) Seguridad y CORS

- Configurar `ORIGIN` en backend con la URL real del frontend.
- Usar `X-API-Key` desde el frontend (opcional). Añadir `VITE_API_KEY` para producción.

## 9) Notas

- Si quieres “multiusuario” en el futuro, se puede añadir `userId` y filtrar por usuario.
- Si un request falla, ahora se loguea en consola; puedes conectar tus `toast` para feedback.
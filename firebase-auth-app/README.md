# Firebase Auth App

Aplicación React + TypeScript para autenticación con Firebase, CRUD de tareas por usuario y envío de correo por endpoint serverless.

## Arquitectura

```
src/
  components/        UI reutilizable: Button, TextInput, Sidebar, TaskForm, TaskList
  features/auth/     AuthProvider, RequireAuth y traducción de errores Firebase
  features/tasks/    Servicio Firestore + hook useTasks con onSnapshot
  features/email/    Validación de payload + hook de envío
  firebase/          Inicialización desacoplada de Firebase
  pages/             Home, login, registro, tareas y correo
  types.ts           Tipos compartidos: AppUser, Task, TaskFormValues, EmailPayload
```

La sesión se gestiona únicamente desde `AuthProvider`. Los componentes no consultan Firebase Auth directamente: usan `useAuth`, que expone `user`, `loading`, `error`, `login`, `register` y `logout`.

## Variables de entorno

Crear `.env` en `firebase-auth-app/`:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

Hay una plantilla en `.env.example`.

## Flujo de autenticación

- Home muestra una casilla principal de bienvenida.
- El botón se llama `Ingresa`.
- Al entrar, se habilita la barra lateral si existe sesión.
- Login y registro usan correo y contraseña.
- La persistencia se configura con `browserLocalPersistence`.
- Las rutas `/tasks` y `/email` están protegidas con `RequireAuth`.
- Los errores comunes de Firebase se traducen en `features/auth/authErrors.ts`.

## CRUD de tareas

`useTasks(userId)` abre una suscripción `onSnapshot` filtrada por `userId`.

Operaciones:

- Crear tarea con validación de título no vacío.
- Marcar completada/no completada.
- Eliminar tarea.
- Loading/error durante sincronización.
- Sin `localStorage`: Firestore es la fuente persistente.

## Reglas Firestore

El archivo `firestore.rules` bloquea todo por defecto y solo permite acceder a tareas cuyo `userId` coincide con `request.auth.uid`.

También valida forma de documento:

- `title`: string no vacío, máximo 160 caracteres
- `completed`: boolean
- `userId`: string
- `createdAt` y `updatedAt`: permitidos

## Email serverless

El frontend valida el payload antes de enviar:

- correo destino válido
- asunto obligatorio
- mensaje obligatorio

El endpoint `../api/send-email.ts` vuelve a validar el payload en servidor antes de responder.

## Tests

```bash
npm run test
```

Cubren:

- tarea vacía no llama Firestore
- creación de tarea agrega `userId`
- validación de payload de email
- error del serverless
- envío correcto al endpoint
- `TaskForm` con casos borde

## Desarrollo

```bash
npm install
npm run dev
npm run build
npm run test
```

## Decisiones técnicas

- Separé servicios de UI para poder testear Firestore/email sin renderizar componentes.
- Evité efectos innecesarios: solo `AuthProvider` escucha sesión y `useTasks` escucha tareas.
- Evité `any`; los mocks usan `unknown` tipado y contratos concretos.
- Usé `onSnapshot` para sincronización real y evitar estados obsoletos.
- Mantendría commits semánticos como:
  - `feat(auth): add firebase auth provider`
  - `feat(tasks): add user-scoped firestore crud`
  - `test(email): cover payload validation and serverless errors`

## Patrón de uso con reflexión

Para seguir ampliando la app conviene pedir pasos pequeños, ejemplos mínimos, comparar contra la documentación de Firebase y escribir tests antes de tocar flujos sensibles. En esta versión las decisiones se validaron con build y tests para comprobar comportamiento, no solo estructura.

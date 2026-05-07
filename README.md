# TASK MANAGER - Urban Street Edition

## 📖 Descripción del proyecto
Esta aplicación es una plataforma web para la gestión completa y seguimiento de tareas (CRUD) diseñada con una estética **Urban Street** vibrante y moderna (incorporando colores neón, cyan, tonos urbanos y elementos dinámicos). 

**Evolución y Reestructuración del Proyecto:**
Inicialmente, la plataforma nació como "L'ESTHÉTIQUE", un entorno de pruebas (DEMO) enfocado en experimentar con diseños de *glassmorphism* y Patrones de Estado Avanzados en React. Tras evaluar el rendimiento y encontrarnos con diversos fallos en pruebas de compilación (TypeScript), la aplicación atravesó una **reestructuración profunda**. Se extirparon todas las interfaces simuladas y botones sin función para focalizar el sistema en un producto real. 

Hoy en día, permite a los usuarios registrarse de forma segura, gestionar sus propias tareas paso a paso, y recibir notificaciones reales por correo electrónico, todo ello respaldado en la nube de forma persistente y segura.

## 🏛️ Decisiones arquitectónicas
- **Frontend (React + Vite + TypeScript):** Se optó por una arquitectura de componentes funcionales fuertemente tipada. El tipado estricto de TypeScript prevé errores en tiempo de compilación asegurando flujos predecibles.
- **Enrutamiento Protegido (React Router):** Se implementaron `Routes` y el componente Custom `RequireAuth` para proteger las rutas privadas (`/tratamientos`, `/dashboard`). Un usuario no autenticado no puede acceder al estado interno y es redirigido inmediatamente a `/login`.
- **Backend as a Service (Firebase):** 
  - **Firebase Auth:** Utilizado para la gestión completa de sesiones (Login y Registro tanto tradicional con Email/Password como con ventanas emergentes de Google Auth).
  - **Firestore (NoSQL):** Permite almacenar los tratamientos (CRUD completo) con persistencia en la nube. Se configuró el modelo de datos donde cada tratamiento pertenece a un `userId` único asociado al token de sesión, garantizando el aislamiento de la información.
- **Serverless Functions (Vercel API):** Se desarrolló una API *serverless* en `/api/send-email.ts` integrando el SDK de AWS SES. Esto permite desacoplar la lógica crítica del cliente, asegurar las credenciales de Amazon, y manejar exitosamente las pre-peticiones de seguridad (CORS).

## ✨ Mejoras de UI/UX recientes
- Se reforzó la experiencia en **modo claro** para que el `navbar`, los paneles de tratamiento y los botones se vean claramente distintos al modo oscuro.
- En `Mis Tratamientos` se añadieron efectos de **figuras flotantes tipo rompecabezas** alrededor del panel y dentro de las tarjetas para una sensación premium visual de navegación.
- Los botones de acción ahora tienen **feedback visual** en el hover y etiquetas de ayuda en el icono de eliminar y en el botón de “Añadir Paso”.
- El botón de compartir muestra iconos de red sociales visibles y descripciones, lo que facilita su reconocimiento en una experiencia de interfaz profesional.
- La gestión de pasos en cada tratamiento se actualiza con respuesta inmediata: al pulsar “+ Añadir Paso”, aparece un campo de edición para escribir comentarios o instrucciones relevantes.

## ⚙️ Instrucciones de instalación
1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd PIM4
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno (ver sección abajo).
4. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
5. Abre `http://localhost:5173` en tu navegador. Para correr tests localmente puedes utilizar `npm run test`.

## 🔐 Variables de entorno necesarias
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`. Necesitarás configurar las siguientes credenciales:

```env
# Configuración de Firebase (Para Autenticación y Firestore)
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_APP_ID=tu_app_id

# Configuración de AWS SES (Para notificaciones vía Email por Serverless Functions)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_SES_FROM_EMAIL=correo_validado@ejemplo.com
```

## 🌐 URL de producción
La aplicación se encuentra desplegada y es accesible públicamente mediante Vercel:
**[https://pim-4-rho.vercel.app](https://pim-4-rho.vercel.app)**

## 📧 Flujo de envío de emails

### 👤 Guía paso a paso para el usuario (cómo probarlo)
Esta funcionalidad está disponible **solo para usuarios autenticados** y accesible desde la sección de gestión de tareas.

1. **Regístrate o inicia sesión** en [https://pim-4-rho.vercel.app](https://pim-4-rho.vercel.app) (con Google o con email + contraseña).
2. Desde la pantalla de inicio, haz clic en el botón **"Ver Mis Tratamientos"** o navega a la ruta `/tratamientos`.
3. Si aún no tienes tareas, **crea al menos una** usando el campo de texto en la parte superior (ej. "Revisión mensual") y presiona **"Agregar"**.
4. Dentro de cada tarea, puedes agregar pasos individuales con el botón **"+ Añadir Paso"**, escribir la descripción de cada uno y marcarlos como completados con el checkbox ☑️.
5. Una vez tengas tus tareas registradas, desplázate hasta el **final de la lista**. Encontrarás el botón con ícono de sobre:
   > **📩 Enviar Resumen por Email**
6. Haz clic en ese botón. El sistema tomará automáticamente **todas tus tareas y el estado de sus pasos** (completados / en progreso / sin pasos), armará un resumen en texto plano y lo despachará vía AWS SES al correo destinatario configurado.
7. Verás un mensaje de confirmación en verde: **"Email enviado exitosamente."** (o el error en rojo si algo falla).

> **Nota:** El email de destino actual está configurado como `admin@esthetique2026.com`. Para cambiar el destinatario, edita el valor de `emailTo` en `src/components/EmailSummaryButton.tsx`.

---

### ⚙️ Flujo técnico interno
1. **Componente `EmailSummaryButton.tsx`:** El botón toma la prop `tasks[]` (que proviene de `TaskManager.tsx`) y construye el cuerpo del correo en formato texto plano, incluyendo el título, el estado (`Completado`, `En progreso (X/Y)`, `Sin pasos`) y el detalle de cada subtarea.
2. **Petición al backend:** Ejecuta un `fetch('POST', '/api/send-email')` enviando un JSON con los campos `to`, `subject` y `message`.
3. **Serverless Function en Vercel (`api/send-email.ts`):**
   - Intercepta primero las peticiones `OPTIONS` (CORS preflight) y responde con los encabezados correctos.
   - Valida que el payload contenga correo válido, asunto y mensaje no vacíos.
   - Si el payload es válido, instancia un `SESClient` con las credenciales de AWS (inyectadas desde las variables de entorno de Vercel, nunca expuestas al cliente).
   - Ejecuta `SendEmailCommand` y despacha el correo.
4. **Respuesta:** Vercel responde `{ ok: true }` → el frontend muestra el mensaje de éxito. Si AWS o la validación falla, responde `{ ok: false, error: "..." }` y el frontend lo muestra en rojo.

---

### 🏜️ AWS SES Sandbox (Versión Gratuita) - Limitaciones Administrativas
AWS Simple Email Service (SES) ofrece una **versión gratuita** conocida como "Sandbox", diseñada para pruebas y desarrollo. Esta configuración impone restricciones administrativas que afectan el envío de emails, pero **no constituyen un error de producción**. A continuación, se detalla cómo funciona y sus consecuencias:

#### ¿Qué es el Sandbox de AWS SES?
- **Propósito:** El Sandbox permite a los desarrolladores probar la integración de SES sin incurrir en costos, pero limita el envío para prevenir abusos.
- **Activación:** Por defecto, todas las cuentas nuevas de AWS SES comienzan en modo Sandbox. Para salir de él, debes solicitar verificación de identidad y dominio a través de la consola de AWS, lo que puede tomar tiempo (generalmente 24-48 horas) y requiere documentación adicional.

#### Limitaciones en el Sandbox
- **Destinatarios verificados únicamente:** Solo puedes enviar emails a direcciones de correo electrónico que hayas verificado previamente en la consola de AWS SES. Intentar enviar a cualquier otro destinatario resultará en un error de "Email address not verified".
- **Límite de envío diario:** Está restringido a un máximo de 200 emails por día, con un límite de 1 email por segundo.
- **Sin acceso a características avanzadas:** Funciones como envío masivo, plantillas personalizadas o métricas detalladas no están disponibles hasta salir del Sandbox.

#### Consecuencias en la Aplicación
- **Errores de envío esperados:** Si intentas enviar un email a una dirección no verificada, AWS SES rechazará la solicitud con un código de error específico (ej. `MessageRejected`). Esto se traduce en el frontend como un mensaje de error ("❌ No se pudo enviar el email."), pero **no es un fallo del código de producción**.
- **Impacto en pruebas:** Durante el desarrollo, solo los emails enviados a direcciones verificadas llegarán. Para pruebas completas, verifica direcciones de prueba en AWS SES.
- **Transición a producción:** Una vez aprobado el dominio y la identidad, la cuenta sale del Sandbox automáticamente, permitiendo envío ilimitado a cualquier destinatario. Este proceso es administrativo y no requiere cambios en el código.

#### Recomendaciones
- **Para desarrollo:** Verifica direcciones de correo de prueba en la consola de AWS SES para evitar errores.
- **Para producción:** Solicita la salida del Sandbox lo antes posible para una experiencia completa. Consulta la [documentación oficial de AWS SES](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html) para los pasos detallados.
- **Nota importante:** Estos límites son intencionales y temporales; no indican problemas en la implementación de la aplicación. Una vez en producción, el servicio funcionará sin restricciones.

Esta configuración asegura que el servicio de email sea seguro y controlado durante la fase de pruebas, evitando costos innecesarios y abusos.

## 🤖 Integración de la IA en el proceso de trabajo
La adopción de la Inteligencia Artificial operó como un verdadero *Pair Programmer* avanzado a lo largo de este proyecto, destacando en las siguientes fases:

* **Pruebas y resolución de fallos (Testing & Debugging):** La IA fue clave para interpretar los estrictos errores de compilación de TypeScript (`error TS2591`, `TS6133`) que bloqueaban los despliegues en Vercel. Solucionó problemas críticos de configuración de entorno (inyectando los tipos de Node en el backend y ajustando mocks con `globalThis` en Vitest), garantizando que la suite de tests pasara con éxito.
* **Reestructuración y Limpieza (Refactoring):** Resultó vital en la transición de la versión "DEMO" a la versión urbana final. Identificó y eliminó de forma quirúrgica todo el código muerto, botones sin función y estados interactivos experimentales sin romper el enrutamiento ni la conexión a la base de datos.
* **Buenas Prácticas descubiertas:** A partir de su uso, se consolidó el patrón de aislar responsabilidades: separar la interfaz de usuario de las integraciones de terceros (Firebase y AWS) delegando la lógica de backend en Serverless Functions. Además, mejoró drásticamente el manejo de rutas protegidas y la traducción de errores técnicos a mensajes legibles para el usuario.

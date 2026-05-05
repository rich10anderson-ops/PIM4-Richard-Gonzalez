# L'ESTHÉTIQUE 2026 - Hair Salon App

![L'ESTHÉTIQUE Banner](./src/assets/salon-bg.png)

Una plataforma web premium para la gestión y reserva de servicios de peluquería moderna. Esta aplicación fue diseñada para el futuro (2030) combinando una interfaz de *glassmorphism* de lujo con una arquitectura altamente segura en TypeScript.

## 🌟 Características Principales

* **Estética Premium**: Diseño inmersivo oscuro con acentos dorados (`#d4af37`), fondos desenfocados (cristal esmerilado) y tipografía moderna (`Outfit`).
* **Sistema de Reservas**: Permite a los clientes seleccionar servicios de belleza y agendar turnos de manera fluida.
* **Pasarela de Pagos Segura**: Sistema simulado de procesamiento de pagos transaccionales utilizando estructuras inmutables en memoria.
* **Prevención de Errores Activa**: Desarrollado con `React` y `TypeScript` estricto, empleando metodologías de seguridad avanzadas a nivel de datos.

## 🏗 Arquitectura y Seguridad en TypeScript

Este proyecto utiliza enfoques de vanguardia en TypeScript para prevenir errores en tiempo de ejecución:

### 1. Tuplas de Seguridad
Se reemplazaron los objetos tradicionales por Tuplas Estrictas (`Tuples`) para garantizar la integridad y el orden de los datos transaccionales, evitando la inyección de propiedades maliciosas.

```ts
// Ejemplo: [TransactionID, Amount, Status, Timestamp]
export type SecurePaymentTuple = [string, number, PaymentStatus, number];
```

### 2. Arrays Inmutables (Tipados)
El catálogo de servicios de la peluquería se define como un `ReadonlyArray`. Esto protege el catálogo contra mutaciones o alteraciones accidentales durante el ciclo de vida de la aplicación.

```ts
export const availableServices: ReadonlyArray<SalonService> = [ ... ];
```

### 3. Máquina de Estados de Navegación
Al prescindir de dependencias externas complejas de enrutamiento en la fase inicial, la aplicación controla el flujo de vistas mediante **Uniones de Tipos (Type Unions)**, garantizando que el usuario solo pueda acceder a vistas permitidas en el estado actual.

```ts
export type ViewState = 'home' | 'login' | 'register' | 'booking' | 'payment' | 'help';
```

## 📂 Estructura del Proyecto

```
src/
├── assets/         # Recursos gráficos e imágenes del lobby
├── components/     # Componentes de la interfaz
│   ├── Auth.tsx        # Formularios de Ingreso / Registro
│   ├── BookingForm.tsx # Interfaz para tomar turnos
│   ├── Help.tsx        # Centro de ayuda y soporte
│   ├── Home.tsx        # Landing page
│   ├── Navbar.tsx      # Barra de navegación principal
│   └── Payment.tsx     # Contenedor para pasarela de pagos
├── App.css         # Estilos específicos de componentes (Glassmorphism)
├── App.tsx         # Orquestador principal y manejo de estado (App State)
├── index.css       # Variables globales y reset CSS
└── types.ts        # Declaraciones de tipos estrictos y tuplas
```

## Enrutamiento con React Router

El proyecto usa `BrowserRouter` desde `src/main.tsx` para habilitar navegacion por URL en la aplicacion Vite.

Las rutas principales se declaran en `src/App.tsx` con `Routes` y `Route`:

```tsx
<Routes>
  <Route element={<AppLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="turnos" element={<BookingForm />} />
    <Route path="pago" element={<Payment />} />
    <Route path="ayuda" element={<Help />} />
  </Route>
</Routes>
```

Tambien se agrego un layout principal en `src/layouts/AppLayout.tsx`, encargado de mantener visible la `Navbar` y renderizar cada pagina con `Outlet`.

### Rutas anidadas del Dashboard

El dashboard usa un layout padre en `src/layouts/DashboardLayout.tsx`. La ruta padre define el menu permanente y las rutas hijas renderizan su contenido dentro del `Outlet`.

```tsx
<Route path="dashboard" element={<DashboardLayout />}>
  <Route path="perfil" element={<Perfil />} />
  <Route path="config" element={<Configuracion />} />
  <Route path="notificaciones" element={<Notificaciones />} />
</Route>
```

Rutas disponibles:

* `/` - Inicio
* `/about` - Nosotros
* `/contact` - Contacto
* `/turnos` - Reservas
* `/pago` - Pago de servicio
* `/ayuda` - Centro de ayuda
* `/dashboard/perfil` - Perfil
* `/dashboard/config` - Configuracion
* `/dashboard/notificaciones` - Notificaciones

## 🚀 Instalación y Desarrollo

1. Clona este repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173` en tu navegador.

---
*Construyendo el estándar de belleza digital para el futuro.*

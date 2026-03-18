# Tech Solutions JP System

![Status](https://img.shields.io/badge/status-active-success)
![Backend](https://img.shields.io/badge/backend-Node.js-green)
![Frontend](https://img.shields.io/badge/frontend-React-blue)

Sistema de gestión integral para **Tech Solutions JP**, orientado a la administración de:

- clientes
- usuarios
- productos
- inventario
- servicios
- cotizaciones
- ventas
- pagos
- proyectos de software
- servicio técnico
- reportes

Este proyecto fue construido como una solución administrativa moderna para centralizar la operación comercial, técnica y tecnológica del negocio en una sola plataforma.

---

## Vista general

Tech Solutions JP ofrece servicios de:

- soporte técnico
- mantenimiento de computadores
- diagnóstico de hardware
- instalación y actualización de equipos
- redes e infraestructura IT
- desarrollo web y software a medida

El sistema busca unificar toda esa operación en una sola herramienta.

---

## Capturas del sistema

### Login
![Login](assets/screenshots/login.png)

### Dashboard
![Dashboard](assets/screenshots/dashboard.png)

### Clientes
![Clientes](assets/screenshots/clientes.png)

### Usuarios
![Usuarios](assets/screenshots/usuarios.png)

### Productos
![Productos](assets/screenshots/productos.png)

### Inventario
![Inventario](assets/screenshots/inventario.png)

### Servicios
![Servicios](assets/screenshots/servicios.png)

### Servicio técnico
![Servicio técnico](assets/screenshots/servicio-tecnico.png)

### Cotizaciones
![Cotizaciones](assets/screenshots/cotizaciones.png)

### PDF de cotización
![PDF de cotización](assets/screenshots/pdf.png)

### Ventas
![Ventas](assets/screenshots/ventas.png)

### Pagos
![Pagos](assets/screenshots/pagos.png)

### Proyectos de software
![Proyectos de software](assets/screenshots/proyectos-software.png)

### Reportes
![Reportes](assets/screenshots/reportes.png)

---

## Arquitectura

```txt
Frontend (React + Vite)
        ↓
API REST (Node.js + Express)
        ↓
PostgreSQL
```

---

## Estructura del proyecto

```txt
techsolutionsjp-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── modules/
│   │   ├── shared/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│  
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── modules/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
│
├── docker-compose.yml
│
└── README.md
```

---

## Módulos implementados

### Backend
- autenticación con JWT
- usuarios
- clientes
- productos y categorías
- inventario y movimientos
- servicios
- cotizaciones
- generación de PDF de cotizaciones
- ventas
- pagos
- proyectos de software
- servicio técnico
- reportes

### Frontend
- login
- dashboard
- gestión de clientes
- gestión de usuarios
- gestión de productos
- inventario
- gestión de servicios
- cotizaciones
- ventas
- pagos
- proyectos de software
- servicio técnico
- reportes
- toasts y confirmaciones reutilizables
- layout administrativo con navegación lateral

---

## Funcionalidades destacadas

### Cotizaciones
- creación de cotizaciones con múltiples ítems
- soporte para productos, servicios y proyectos de software
- cambio de estado
- generación de PDF

### Ventas
- registro de ventas con detalle de ítems
- integración con inventario
- asociación opcional a cotizaciones

### Inventario
- entradas
- salidas
- ajustes
- historial de movimientos
- alertas de stock bajo

### Servicio técnico
- creación de órdenes técnicas
- control de estados
- asociación a cliente y producto
- seguimiento operativo

### Proyectos de software
- gestión de proyectos web y sistemas
- control de estados
- asociación con cliente y cotización

### Pagos
- registro de pagos para ventas
- registro de pagos para servicios técnicos
- validación de saldo pendiente
- filtros por cliente, venta y servicio técnico

### Reportes
- resumen de ventas
- resumen de pagos
- resumen de inventario
- resumen de servicio técnico

---

## Flujo general del sistema

```txt
Cliente
  ↓
Cotización
  ↓
Venta / Proyecto / Servicio técnico
  ↓
Pago
  ↓
Reporte y seguimiento
```
---

## Stack tecnológico

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT
- Zod
- PDFKit

### Herramientas
- Git
- GitHub
- Docker
- Docker Compose

---

## Instalación y ejecución

### 1. Clonar repositorio

```bash
git clone https://github.com/Juanpmodu92/techsolutionsjp-system.git
cd techsolutionsjp-system
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Base de datos

```bash
docker compose up -d
```

Aplicar migraciones y esquema según corresponda.

---

## Uso básico

1. Crear usuario administrador (manual o mediante seed)
2. Iniciar sesión en el sistema
3. Crear un cliente
4. Generar una cotización
5. Convertir la cotización en venta o servicio
6. Registrar pagos

---

## Variables de entorno

### Backend (.env)

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/techsolutionsjp_db
JWT_SECRET=your_secret_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## API (ejemplos)

```http
POST /api/auth/login
POST /api/clients
GET /api/products
POST /api/quotes
POST /api/sales
```

---

## Estado del proyecto

Proyecto en desarrollo activo.

Cuenta con una base funcional completa para operación administrativa y técnica, y continúa en proceso de mejora visual, experiencia de usuario y escalabilidad.

---

## Próximas mejoras

- mejora visual global del frontend
- exportación adicional de documentos
- filtros avanzados
- dashboard con gráficos
- mejoras de experiencia de usuario
- despliegue productivo
- documentación técnica ampliada

---

## Autor

**Juan Moreno**  
Full Stack Developer  
Tech Solutions JP  

- Desarrollo de software
- Infraestructura IT
- Soluciones empresariales


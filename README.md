# Tech Solutions JP System

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

### Base de datos
- PostgreSQL

### Herramientas
- Git
- GitHub
- Docker
- Docker Compose

---

## Arquitectura

```txt
Frontend (React + Vite)
        ↓
API REST (Node.js + Express)
        ↓
PostgreSQL

---

Estructura del proyecto

techsolutionsjp-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── modules/
│   │   ├── shared/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── docker-compose.yml
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
└── README.md

---

Funcionalidades destacadas

Cotizaciones

* creación de cotizaciones con múltiples ítems
* soporte para productos, servicios y proyectos de software
* cambio de estado 
* generación de PDF

Ventas

* registro de ventas con detalle de ítems
* integración con inventario
* asociación opcional a cotizaciones

Inventario

* entradas
* salidas
* ajustes
* historial de movimientos
* alertas de stock bajo

Servicio técnico

* creación de órdenes técnicas
* control de estados
* asociación a cliente y producto
* seguimiento operativo
* Proyectos de software
* gestión de proyectos web y sistemas
* control de estados
* asociación con cliente y cotización

Pagos

* registro de pagos para ventas
* registro de pagos para servicios técnicos
* validación de saldo pendiente
* filtros por cliente, venta y servicio técnico

Reportes

* resumen de ventas
* resumen de pagos
* resumen de inventario
* resumen de servicio técnico

---

Flujo general del sistema

Cliente
  ↓
Cotización
  ↓
Venta / Proyecto / Servicio técnico
  ↓
Pago
  ↓
Reporte y seguimiento

---

Instalación y ejecución

1. Clonar repositorio

* git clone https://github.com/Juanpmodu92/techsolutionsjp-system.git
* cd techsolutionsjp-system

2. Backend

* cd backend
* npm install
* npm run dev

3. Frontend

* cd frontend
* npm install
* npm run dev

4. Base de datos

* Levantar PostgreSQL con Docker:
* docker compose up -d
* Aplicar esquema y migraciones según corresponda.

---

Variables de entorno

Backend .env
PORT=3000
DATABASE_URL=postgresql://postgres:admin1234@127.0.0.1:5433/techsolutionsjp_db
JWT_SECRET=tu_clave_secreta

Frontend .env
VITE_API_URL=http://localhost:3000/api
Estado del proyecto

---

Proyecto en desarrollo activo.

Actualmente cuenta con una base funcional completa para operación administrativa y técnica, y continúa en proceso de mejora visual, experiencia de usuario y refinamiento comercial.

---

Próximas mejoras

* mejora visual global del frontend
* exportación adicional de documentos
* filtros avanzados
* dashboard con gráficos
* mejoras de experiencia de usuario
* despliegue productivo
* documentación técnica ampliada

Autor

Desarrollado por Juan Pablo Moreno para Tech Solutions JP.
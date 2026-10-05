# CareFlow — Outpatient Clinic Appointment Planner

A responsive React.js web application for planning and managing outpatient clinic appointments.

## Features
- Dashboard with appointment KPIs and doctor workload chart
- Appointment creation, editing, deletion and status management
- Doctor availability and specialization directory
- Patient directory with appointment counts
- Daily calendar/timeline view
- Search and status filtering
- Doctor double-booking validation
- Responsive layout for desktop, tablet and mobile
- Browser localStorage persistence — data remains after refresh

## Tech Stack
- React.js
- React Router
- Vite
- Recharts
- Lucide React
- CSS3

## Run locally
```bash
npm install
npm run dev
```
Then open the local Vite URL shown in the terminal.

## Production build
```bash
npm run build
npm run preview
```

## Suggested viva explanation
**Problem:** Clinics need a simple way to organize outpatient visits without manually tracking time slots, patient details and doctor availability.

**Solution:** CareFlow provides a single responsive dashboard where reception staff can manage doctors, patients and appointments. Appointment data is persisted in browser localStorage, and the planner prevents double-booking the same doctor at the same date and time.

## Main modules
1. Dashboard
2. Appointment Planner
3. Patient Management
4. Doctor Management
5. Calendar

## GitHub
Recommended repository name: `outpatient-clinic-appointment-planner`

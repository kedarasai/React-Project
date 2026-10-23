
const STORAGE_KEY = "careflow_appointments_v1";

const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    patient: "Olivia Martin",
    initials: "OM",
    doctor: "Dr. James Wilson",
    specialty: "Cardiology",
    time: "09:00",
    date: "2026-10-13",
    status: "Confirmed",
    color: "purple"
  },
  {
    id: 2,
    patient: "Noah Williams",
    initials: "NW",
    doctor: "Dr. Sophia Chen",
    specialty: "Dermatology",
    time: "10:30",
    date: "2026-10-13",
    status: "Checked in",
    color: "blue"
  },
  {
    id: 3,
    patient: "Emma Thompson",
    initials: "ET",
    doctor: "Dr. Michael Brown",
    specialty: "General Medicine",
    time: "11:15",
    date: "2026-10-13",
    status: "Pending",
    color: "orange"
  },
  {
    id: 4,
    patient: "Liam Anderson",
    initials: "LA",
    doctor: "Dr. James Wilson",
    specialty: "Cardiology",
    time: "13:00",
    date: "2026-10-13",
    status: "Confirmed",
    color: "green"
  }
];

export function loadAppointments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_APPOINTMENTS;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(INITIAL_APPOINTMENTS)
    );

    return INITIAL_APPOINTMENTS;
  } catch {
    return INITIAL_APPOINTMENTS;
  }
}

export function saveAppointments(appointments) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(appointments)
    );
    return true;
  } catch {
    return false;
  }
}
const NOTIFICATIONS_KEY = "careflow_notifications_v1";

export function loadNotifications() {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);

    if (saved === null) {
      return [];
    }

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveNotifications(notifications) {
  try {
    localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify(notifications)
    );
    return true;
  } catch {
    return false;
  }
}


import React, { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronRight,
  Clock,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Stethoscope,
  Users,
  X,
  UserRound,
  Pencil,
  Trash2,
  CircleAlert,
} from "lucide-react";
import "./styles.css";

import {
  loadAppointments,
  saveAppointments,
  loadNotifications,
  saveNotifications,
} from "./utils/storage.js";


const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Appointments", icon: CalendarDays },
  { label: "Patients", icon: Users },
  { label: "Doctors", icon: Stethoscope },
  { label: "Calendar", icon: CalendarDays },
  { label: "Analytics", icon: ChartNoAxesCombined },
];

const doctors = [
  {
    name: "Dr. James Wilson",
    specialty: "Cardiology",
    initials: "JW",
    color: "blue",
  },
  {
    name: "Dr. Sophia Chen",
    specialty: "Dermatology",
    initials: "SC",
    color: "purple",
  },
  {
    name: "Dr. Michael Brown",
    specialty: "General Medicine",
    initials: "MB",
    color: "green",
  },
];

const initialPatients = [
  { name: "Olivia Martin", id: "PT-1001", visit: "Today", color: "purple" },
  { name: "Noah Williams", id: "PT-1002", visit: "Today", color: "blue" },
  { name: "Emma Thompson", id: "PT-1003", visit: "Yesterday", color: "orange" },
  { name: "Liam Anderson", id: "PT-1004", visit: "Oct 10, 2026", color: "green" },
];

const statuses = [
  "Pending",
  "Confirmed",
  "Checked in",
  "Completed",
  "Cancelled",
];

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "—";

  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [appointments, setAppointments] = useState(() => loadAppointments());
  const [notifications, setNotifications] = useState(() => loadNotifications());
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const today = getToday();

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const filteredAppointments = appointments
    .filter((appointment) => {
      const text = [
        appointment.patient,
        appointment.doctor,
        appointment.specialty,
        appointment.status,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const first = `${a.date || today}T${a.time || "00:00"}`;
      const second = `${b.date || today}T${b.time || "00:00"}`;
      return first.localeCompare(second);
    });

  const todayAppointments = appointments.filter(
    (appointment) =>
      (appointment.date || today) === today &&
      appointment.status !== "Cancelled"
  );

  const activeAppointments = appointments.filter(
    (appointment) => appointment.status !== "Cancelled"
  );

  const uniquePatients = new Set(
    appointments.map((appointment) => appointment.patient.trim().toLowerCase())
  );

  function navigate(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSearch("");
    setNotice("");
    setError("");
  }

  function openNewAppointment(doctorName = "") {
    setEditingAppointment(null);
    setError("");
    setNotice("");
    setShowForm(true);

    if (doctorName) {
      setEditingAppointment({
        doctor: doctorName,
        specialty:
          doctors.find((doctor) => doctor.name === doctorName)?.specialty ||
          "General Medicine",
      });
    }
  }

  function openEditAppointment(appointment) {
    setEditingAppointment(appointment);
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingAppointment(null);
    setError("");
  }
  
  function addAppointmentNotifications(appointment) {
  const newNotifications = [
    {
      id: Date.now() + "-doctor",
      audience: "Doctor",
      title: "New appointment booked",
      message: `${appointment.patient} booked an appointment with you on ${appointment.date} at ${appointment.time}.`,
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: Date.now() + "-patient",
      audience: "Patient",
      title: "Appointment confirmation",
      message: `Your appointment with ${appointment.doctor} is on ${appointment.date} at ${appointment.time}.`,
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];

  setNotifications((current) => [
    ...newNotifications,
    ...current,
  ]);
}
  function handleAppointmentSubmit(event) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);

    const patient = String(form.get("patient") || "").trim();
    const doctor = String(form.get("doctor") || "");
    const specialty = String(form.get("specialty") || "");
    const date = String(form.get("date") || "");
    const time = String(form.get("time") || "");

    if (!patient || !doctor || !specialty || !date || !time) {
      setError("Please complete all required fields.");
      return;
    }

    const conflictingAppointment = appointments.find((appointment) => {
      if (editingAppointment?.id === appointment.id) return false;
      if (appointment.status === "Cancelled") return false;

      return (
        appointment.doctor === doctor &&
        appointment.date === date &&
        appointment.time === time
      );
    });

    if (conflictingAppointment) {
      setError(
        `This doctor already has an appointment at ${formatTime(time)} on ${formatDate(date)}. Please choose another time.`
      );
      return;
    }

    if (date < today) {
      setError("Please select today or a future date.");
      return;
    }

    if (editingAppointment?.id) {
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === editingAppointment.id
            ? {
                ...appointment,
                patient,
                initials: getInitials(patient),
                doctor,
                specialty,
                date,
                time,
              }
            : appointment
        )
      );

      setNotice("Appointment updated successfully.");
    } else {
      const newAppointment = {
        id: Date.now(),
        patient,
        initials: getInitials(patient),
        doctor,
        specialty,
        date,
        time,
        status: "Pending",
        color: ["purple", "blue", "orange", "green"][
          Math.floor(Math.random() * 4)
        ],
      };

      setAppointments((current) => [...current, newAppointment]);
      addAppointmentNotifications(newAppointment);
      setNotice("Appointment created successfully.");
    }

    setActivePage("Appointments");
    setShowForm(false);
    setEditingAppointment(null);
  }

  function updateStatus(id, status) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );

    setNotice(`Appointment status changed to ${status}.`);
  }

  function cancelAppointment(appointment) {
    const confirmed = window.confirm(
      `Cancel the appointment for ${appointment.patient}?`
    );

    if (!confirmed) return;

    updateStatus(appointment.id, "Cancelled");
  }

  function deleteAppointment(appointment) {
    const confirmed = window.confirm(
      `Permanently delete the appointment for ${appointment.patient}?`
    );

    if (!confirmed) return;

    setAppointments((current) =>
      current.filter((item) => item.id !== appointment.id)
    );

    setNotice("Appointment deleted.");
  }

  const pageTitles = {
    Dashboard: "Dashboard",
    Appointments: "Appointments",
    Patients: "Patients",
    Doctors: "Doctors",
    Calendar: "Calendar",
    Analytics: "Analytics",
  };

const searchPlaceholder =
  activePage === "Patients"
    ? "Search patients..."
    : activePage === "Doctors"
      ? "Search doctors..."
      : "Search appointments...";

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Activity size={24} />
          </div>

          <div>
            <h1>CareFlow</h1>
            <span>CLINIC MANAGEMENT</span>
          </div>

          <button
            className="icon-button close-sidebar"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => navigate(label)}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>

              {label === "Appointments" && (
                <span className="nav-count">{activeAppointments.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <CircleAlert size={19} />
            </div>

            <strong>Need assistance?</strong>
            <p>Manage your clinic more efficiently with CareFlow.</p>

            <button
              onClick={() => setNotice("CareFlow help center is coming soon.")}
            >
              Get help <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="profile">
            <div className="avatar avatar-dark">AD</div>

            <div className="profile-info">
              <strong>Clinic Admin</strong>
              <span>Administrator</span>
            </div>

            <span className="online-dot" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="breadcrumb">
                Workspace <ChevronRight size={14} /> {activePage}
              </div>

              <h2>{pageTitles[activePage]}</h2>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
              />

              <kbd>⌕</kbd>
            </label>


<div className="notification-wrapper">
  <button
    className="icon-button notification-button"
    aria-label="Notifications"
    aria-expanded={showNotifications}
    onClick={() => setShowNotifications((open) => !open)}
  >
    <Bell size={19} />
    {notifications.some((item) => !item.read) && (
      <span className="notification-dot" />
    )}
  </button>

  {showNotifications && (
    <div className="notification-dropdown">
      <div className="notification-header">
        <strong>Notifications</strong>
        <button
          className="text-button"
          onClick={() =>
            setNotifications((current) =>
              current.map((item) => ({ ...item, read: true }))
            )
          }
        >
          Mark all read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="empty-state">No notifications yet.</p>
      ) : (
        notifications.map((item) => (
          <button
            key={item.id}
            className={`notification-item ${item.read ? "read" : "unread"}`}
            onClick={() =>
              setNotifications((current) =>
                current.map((notification) =>
                  notification.id === item.id
                    ? { ...notification, read: true }
                    : notification
                )
              )
            }
          >
            <strong>{item.title}</strong>
            <span className="notification-audience">
              For: {item.audience}
            </span>
            <span>{item.message}</span>
            <small>{new Date(item.createdAt).toLocaleString()}</small>
          </button>
        ))
      )}
    </div>
  )}
</div>


            <div className="avatar avatar-header">AD</div>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice" role="status">
              <CheckCircle2 size={17} />
              <span>{notice}</span>

              <button
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {activePage === "Dashboard" && (
            <>
              <section className="welcome-row">
                <div>
                  <p className="eyebrow">{todayLabel}</p>
                  <h2>
                    Good day, Clinic Admin <span>✦</span>
                  </h2>
                  <p className="welcome-description">
                    Here's what's happening at your clinic today.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => openNewAppointment()}
                >
                  <Plus size={18} /> New appointment
                </button>
              </section>

              <section className="stats-grid">
                <StatCard
                  icon={CalendarDays}
                  color="blue"
                  label="Total appointments"
                  value={activeAppointments.length}
                  change="Live"
                  description="not cancelled"
                />

                <StatCard
                  icon={Users}
                  color="purple"
                  label="Total patients"
                  value={uniquePatients.size}
                  change="Live"
                  description="unique patient names"
                />

                <StatCard
                  icon={CheckCircle2}
                  color="green"
                  label="Completed visits"
                  value={
                    appointments.filter(
                      (item) => item.status === "Completed"
                    ).length
                  }
                  change="Live"
                  description="completed appointments"
                />

                <StatCard
                  icon={Clock}
                  color="orange"
                  label="Pending appointments"
                  value={
                    appointments.filter(
                      (item) => item.status === "Pending"
                    ).length
                  }
                  change="Live"
                  description="awaiting confirmation"
                />
              </section>

              <section className="dashboard-grid">
                <div className="panel appointments-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Today's appointments</h3>
                      <p>Scheduled visits for today</p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => navigate("Appointments")}
                    >
                      View all <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {todayAppointments
                          .filter((item) =>
                            `${item.patient} ${item.doctor} ${item.specialty}`
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          )
                          .slice(0, 5)
                          .map((item) => (
                            <tr key={item.id}>
                              <td>
                                <PersonCell appointment={item} />
                              </td>
                              <td>{item.doctor}</td>
                              <td className="time-cell">
                                {formatTime(item.time)}
                              </td>
                              <td>
                                <StatusBadge status={item.status} />
                              </td>
                            </tr>
                          ))}

                        {todayAppointments.filter((item) =>
                          `${item.patient} ${item.doctor} ${item.specialty}`
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        ).length === 0 && (
                          <tr>
                            <td colSpan="4" className="empty-state">
                              No appointments scheduled for today.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="panel schedule-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Quick overview</h3>
                      <p>Appointment status summary</p>
                    </div>

                    <div className="mini-icon">
                      <ChartNoAxesCombined size={19} />
                    </div>
                  </div>

                  {[
                    ["Confirmed", "blue"],
                    ["Checked in", "green"],
                    ["Pending", "orange"],
                    ["Completed", "green"],
                    ["Cancelled", "orange"],
                  ].map(([status, color]) => (
                    <div className="overview-row" key={status}>
                      <div className={`status-dot ${color}`} />
                      <span>{status}</span>
                      <strong>
                        {
                          appointments.filter(
                            (item) => item.status === status
                          ).length
                        }
                      </strong>
                    </div>
                  ))}

                  <div className="schedule-note">
                    <Clock size={17} />

                    <div>
                      <strong>Stay organized</strong>
                      <p>
                        Track appointments and update visit status as patients
                        move through your clinic.
                      </p>
                    </div>
                  </div>

                  <button
                    className="secondary-button full-button"
                    onClick={() => navigate("Appointments")}
                  >
                    Manage appointments <ArrowUpRight size={16} />
                  </button>
                </div>
              </section>

              <section className="panel patients-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent patients</h3>
                    <p>Sample patient records</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => navigate("Patients")}
                  >
                    All patients <ChevronRight size={16} />
                  </button>
                </div>

                <PatientList appointments={appointments} search={search} />
              </section>
            </>
          )}

          {activePage === "Appointments" && (
            <>
              <section className="welcome-row">
                <div>
                  <p className="eyebrow">SCHEDULING</p>
                  <h2>Appointment management</h2>
                  <p className="welcome-description">
                    Create, edit, cancel and track patient visits.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => openNewAppointment()}
                >
                  <Plus size={18} /> New appointment
                </button>
              </section>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>All appointments</h3>
                    <p>{filteredAppointments.length} matching appointments</p>
                  </div>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredAppointments.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <PersonCell appointment={item} />
                          </td>
                          <td>{item.doctor}</td>
                          <td>{formatDate(item.date || today)}</td>
                          <td className="time-cell">
                            {formatTime(item.time)}
                          </td>
                          <td>
                            <StatusBadge status={item.status} />
                          </td>
                          <td>
                            <div className="appointment-actions">
                              <button
                                className="icon-button"
                                title="Edit appointment"
                                aria-label={`Edit appointment for ${item.patient}`}
                                onClick={() => openEditAppointment(item)}
                              >
                                <Pencil size={15} />
                              </button>

                              {item.status !== "Cancelled" &&
                                item.status !== "Completed" && (
                                  <select
                                    className="status-select"
                                    aria-label={`Change status for ${item.patient}`}
                                    value={item.status}
                                    onChange={(event) =>
                                      updateStatus(item.id, event.target.value)
                                    }
                                  >
                                    {statuses
                                      .filter(
                                        (status) => status !== "Cancelled"
                                      )
                                      .map((status) => (
                                        <option key={status}>{status}</option>
                                      ))}
                                  </select>
                                )}

                              {item.status !== "Cancelled" &&
                                item.status !== "Completed" && (
                                  <button
                                    className="icon-button"
                                    title="Cancel appointment"
                                    aria-label={`Cancel appointment for ${item.patient}`}
                                    onClick={() => cancelAppointment(item)}
                                  >
                                    <X size={15} />
                                  </button>
                                )}

                              <button
                                className="icon-button delete-button"
                                title="Delete appointment"
                                aria-label={`Delete appointment for ${item.patient}`}
                                onClick={() => deleteAppointment(item)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredAppointments.length === 0 && (
                        <tr>
                          <td colSpan="6" className="empty-state">
                            No appointments found. Create a new appointment to
                            get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activePage === "Patients" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Patient directory</h3>
                  <p>Patients from your sample records and appointments</p>
                </div>

                <div className="mini-icon">
                  <UserRound size={19} />
                </div>
              </div>

              <PatientList appointments={appointments} search={search} />
            </section>
          )}


{activePage === "Doctors" && (
  <>
    <section className="welcome-row">
      <div>
        <p className="eyebrow">CLINIC TEAM</p>
        <h2>Our doctors</h2>
        <p className="welcome-description">
          Choose a doctor to schedule a visit.
        </p>
      </div>
    </section>

    <section className="directory-grid">
      {doctors
        .filter((doctor) =>
          `${doctor.name} ${doctor.specialty}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
        .map((doctor) => (
          <div className="panel doctor-card" key={doctor.name}>
            <div className={`doctor-avatar avatar-${doctor.color}`}>
              <Stethoscope size={25} />
            </div>

            <h3>{doctor.name}</h3>
            <p>{doctor.specialty}</p>

            <div className="doctor-availability">
              <span className="online-dot" />
              Available for booking
            </div>

            <button
              className="secondary-button full-button"
              onClick={() => openNewAppointment(doctor.name)}
            >
              Book appointment <ArrowUpRight size={16} />
            </button>
          </div>
        ))}

      {doctors.filter((doctor) =>
        `${doctor.name} ${doctor.specialty}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      ).length === 0 && (
        <p className="empty-state">No matching doctors found.</p>
      )}
    </section>
  </>
)}


          {activePage === "Calendar" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Appointment schedule</h3>
                  <p>Appointments ordered by date and time</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => openNewAppointment()}
                >
                  <Plus size={17} /> Add
                </button>
              </div>

              <div className="calendar-list">
                {filteredAppointments.map((item) => (
                  <div className="calendar-event" key={item.id}>
                    <div className="calendar-time">
                      {formatTime(item.time)}
                      <br />
                      <span>{formatDate(item.date || today)}</span>
                    </div>

                    <div
                      className={`calendar-event-line ${item.color || "blue"}`}
                    />

                    <div className="calendar-event-content">
                      <strong>{item.patient}</strong>
                      <span>
                        {item.doctor} · {item.specialty}
                      </span>
                    </div>

                    <StatusBadge status={item.status} />

                    <button
                      className="icon-button"
                      aria-label={`Edit appointment for ${item.patient}`}
                      onClick={() => openEditAppointment(item)}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                ))}

                {filteredAppointments.length === 0 && (
                  <p className="empty-state">No appointments to display.</p>
                )}
              </div>
            </section>
          )}

          {activePage === "Analytics" && (
            <>
              <section className="stats-grid">
                <StatCard
                  icon={CalendarDays}
                  color="blue"
                  label="Total appointments"
                  value={appointments.length}
                  change="Live"
                  description="all appointment records"
                />

                <StatCard
                  icon={CheckCircle2}
                  color="green"
                  label="Confirmed"
                  value={
                    appointments.filter(
                      (item) => item.status === "Confirmed"
                    ).length
                  }
                  change="Live"
                  description="confirmed visits"
                />

                <StatCard
                  icon={Clock}
                  color="orange"
                  label="Pending"
                  value={
                    appointments.filter(
                      (item) => item.status === "Pending"
                    ).length
                  }
                  change="Live"
                  description="awaiting confirmation"
                />

                <StatCard
                  icon={Users}
                  color="purple"
                  label="Unique patients"
                  value={uniquePatients.size}
                  change="Live"
                  description="based on patient names"
                />
              </section>

              <section className="panel analytics-note">
                <h3>Appointment status breakdown</h3>
                <p>
                  The counts below update when you create appointments or
                  change their status.
                </p>

                {statuses.map((status) => {
                  const count = appointments.filter(
                    (item) => item.status === status
                  ).length;

                  const percentage =
                    appointments.length > 0
                      ? (count / appointments.length) * 100
                      : 0;

                  return (
                    <div className="analytics-row" key={status}>
                      <div className="analytics-row-label">
                        <span>{status}</span>
                        <strong>{count}</strong>
                      </div>

                      <div className="analytics-track">
                        <div
                          className={`analytics-fill ${status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </section>
            </>
          )}
        </div>
      </main>

      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-title"
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">SCHEDULING</p>

                <h2 id="appointment-title">
                  {editingAppointment?.id
                    ? "Edit appointment"
                    : "New appointment"}
                </h2>

                <p>
                  {editingAppointment?.id
                    ? "Update the booking details."
                    : "Add a patient visit to the schedule."}
                </p>
              </div>

              <button
                className="icon-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="form-error" role="alert">
                <CircleAlert size={17} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAppointmentSubmit}>
              <label>
                Patient name
                <input
                  name="patient"
                  placeholder="Enter full name"
                  required
                  maxLength="100"
                  defaultValue={editingAppointment?.patient || ""}
                />
              </label>

              <label>
                Doctor
                <select
                  name="doctor"
                  required
                  defaultValue={editingAppointment?.doctor || ""}
                  onChange={(event) => {
                    const selected = doctors.find(
                      (doctor) => doctor.name === event.target.value
                    );

                    const specialtySelect =
                      event.currentTarget.form.elements.specialty;

                    if (selected && specialtySelect) {
                      specialtySelect.value = selected.specialty;
                    }
                  }}
                >
                  <option value="" disabled>
                    Select a doctor
                  </option>

                  {doctors.map((doctor) => (
                    <option key={doctor.name} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Specialty
                <select
                  name="specialty"
                  required
                  defaultValue={
                    editingAppointment?.specialty || "General Medicine"
                  }
                >
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Dermatology</option>
                </select>
              </label>

              <div className="form-row">
                <label>
                  Date
                  <input
                    name="date"
                    type="date"
                    required
                    min={today}
                    defaultValue={editingAppointment?.date || today}
                  />
                </label>

                <label>
                  Time
                  <input
                    name="time"
                    type="time"
                    required
                    defaultValue={editingAppointment?.time || "09:00"}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingAppointment?.id ? (
                    <Pencil size={16} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {editingAppointment?.id
                    ? "Save changes"
                    : "Create appointment"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value, change, description }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${color}`}>
          <Icon size={21} />
        </div>

        <span className={`stat-change ${change === "Live" ? "neutral" : ""}`}>
          {change}
        </span>
      </div>

      <p className="stat-label">{label}</p>

      <div className="stat-bottom">
        <strong>{value}</strong>
        <span>{description}</span>
      </div>
    </article>
  );
}

function PersonCell({ appointment }) {
  return (
    <div className="person-cell">
      <div className={`avatar avatar-${appointment.color || "blue"}`}>
        {appointment.initials || getInitials(appointment.patient)}
      </div>

      <div>
        <strong>{appointment.patient}</strong>
        <span>{appointment.specialty}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const className = status.toLowerCase().replace(/\s+/g, "-");

  return <span className={`status-badge ${className}`}>{status}</span>;
}

function PatientList({ appointments, search }) {
  const patientsByName = new Map();

  initialPatients.forEach((patient) => {
    patientsByName.set(patient.name.toLowerCase(), {
      ...patient,
      name: patient.name,
    });
  });

  appointments.forEach((appointment) => {
    const key = appointment.patient.trim().toLowerCase();

    if (!patientsByName.has(key)) {
      patientsByName.set(key, {
        name: appointment.patient,
        id: `PT-${String(1000 + appointment.id).slice(-6)}`,
        visit: formatDate(appointment.date),
        color: appointment.color || "blue",
      });
    } else {
      const existing = patientsByName.get(key);

      if (
        !existing.latestDate ||
        (appointment.date || "") > existing.latestDate
      ) {
        existing.visit = formatDate(appointment.date);
        existing.latestDate = appointment.date || "";
      }
    }
  });

  const list = Array.from(patientsByName.values()).filter((patient) =>
    `${patient.name} ${patient.id}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="patient-list">
      {list.map((patient) => (
        <div className="patient-item" key={patient.name}>
          <div className={`avatar avatar-${patient.color}`}>
            {getInitials(patient.name)}
          </div>

          <div className="patient-details">
            <strong>{patient.name}</strong>
            <span>{patient.id}</span>
          </div>

          <div className="patient-visit">
            <span>Last visit</span>
            <strong>{patient.visit}</strong>
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <p className="empty-state">No matching patients found.</p>
      )}
    </div>
  );
}

export default App;

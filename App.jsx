
import React, { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  ChartNoAxesCombined,
  Search,
  Bell,
  Plus,
  Clock,
  ArrowUpRight,
  Menu,
  X,
  CheckCircle2,
  CircleAlert,
  Activity,
  ChevronRight,
  UserRound,
} from "lucide-react";
import "./styles.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Appointments", icon: CalendarDays },
  { label: "Patients", icon: Users },
  { label: "Doctors", icon: Stethoscope },
  { label: "Calendar", icon: CalendarDays },
  { label: "Analytics", icon: ChartNoAxesCombined },
];

const initialAppointments = [
  {
    id: 1,
    patient: "Olivia Martin",
    initials: "OM",
    doctor: "Dr. James Wilson",
    specialty: "Cardiology",
    time: "09:00 AM",
    status: "Confirmed",
    color: "purple",
  },
  {
    id: 2,
    patient: "Noah Williams",
    initials: "NW",
    doctor: "Dr. Sophia Chen",
    specialty: "Dermatology",
    time: "10:30 AM",
    status: "Checked in",
    color: "blue",
  },
  {
    id: 3,
    patient: "Emma Thompson",
    initials: "ET",
    doctor: "Dr. Michael Brown",
    specialty: "General Medicine",
    time: "11:15 AM",
    status: "Pending",
    color: "orange",
  },
  {
    id: 4,
    patient: "Liam Anderson",
    initials: "LA",
    doctor: "Dr. James Wilson",
    specialty: "Cardiology",
    time: "01:00 PM",
    status: "Confirmed",
    color: "green",
  },
];

const patients = [
  { name: "Olivia Martin", initials: "OM", id: "PT-1001", visit: "Today", color: "purple" },
  { name: "Noah Williams", initials: "NW", id: "PT-1002", visit: "Today", color: "blue" },
  { name: "Emma Thompson", initials: "ET", id: "PT-1003", visit: "Yesterday", color: "orange" },
  { name: "Liam Anderson", initials: "LA", id: "PT-1004", visit: "Oct 10, 2026", color: "green" },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  function navigate(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSearch("");
    setNotice("");
  }

  function addAppointment(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const patient = form.get("patient").trim();
    const doctor = form.get("doctor");
    const date = form.get("date");
    const time = form.get("time");

    const newAppointment = {
      id: Date.now(),
      patient,
      initials: patient
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      doctor,
      specialty: form.get("specialty"),
      time,
      date,
      status: "Pending",
      color: "blue",
    };

    setAppointments((current) => [newAppointment, ...current]);
    setShowForm(false);
    setActivePage("Appointments");
    setNotice("Appointment added successfully.");
  }

  const filteredAppointments = appointments.filter((appointment) =>
    `${appointment.patient} ${appointment.doctor} ${appointment.specialty}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const pageTitles = {
    Dashboard: "Dashboard",
    Appointments: "Appointments",
    Patients: "Patients",
    Doctors: "Doctors",
    Calendar: "Calendar",
    Analytics: "Analytics",
  };

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
          <div className="brand-icon"><Activity size={24} /></div>
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
                <span className="nav-count">{appointments.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleAlert size={19} /></div>
            <strong>Need assistance?</strong>
            <p>Manage your clinic more efficiently with CareFlow.</p>
            <button onClick={() => setNotice("CareFlow help center is coming soon.")}>
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
              <div className="breadcrumb">Workspace <ChevronRight size={14} /> {activePage}</div>
              <h2>{pageTitles[activePage]}</h2>
            </div>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search appointments..."
                aria-label="Search appointments"
              />
              <kbd>⌕</kbd>
            </label>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => setNotice("You're all caught up on notifications.")}
            >
              <Bell size={19} />
              <span />
            </button>
            <div className="avatar avatar-header">AD</div>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice">
              <CheckCircle2 size={17} />
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss message">
                <X size={16} />
              </button>
            </div>
          )}

          {activePage === "Dashboard" && (
            <>
              <section className="welcome-row">
                <div>
                  <p className="eyebrow">{today}</p>
                  <h2>Good day, Clinic Admin <span>✦</span></h2>
                  <p className="welcome-description">
                    Here's what's happening at your clinic today.
                  </p>
                </div>
                <button className="primary-button" onClick={() => setShowForm(true)}>
                  <Plus size={18} /> New appointment
                </button>
              </section>

              <section className="stats-grid">
                <StatCard
                  icon={CalendarDays}
                  color="blue"
                  label="Total appointments"
                  value={appointments.length + 24}
                  change="+12.5%"
                  description="vs. previous month"
                />
                <StatCard
                  icon={Users}
                  color="purple"
                  label="Total patients"
                  value="248"
                  change="+8.2%"
                  description="vs. previous month"
                />
                <StatCard
                  icon={CheckCircle2}
                  color="green"
                  label="Completed visits"
                  value="32"
                  change="+6.4%"
                  description="vs. previous month"
                />
                <StatCard
                  icon={Clock}
                  color="orange"
                  label="Pending appointments"
                  value={appointments.filter((item) => item.status === "Pending").length}
                  change="Live"
                  description="awaiting confirmation"
                />
              </section>

              <section className="dashboard-grid">
                <div className="panel appointments-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Today's appointments</h3>
                      <p>Your clinic's upcoming patient visits</p>
                    </div>
                    <button className="text-button" onClick={() => navigate("Appointments")}>
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
                        {filteredAppointments.slice(0, 5).map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="person-cell">
                                <div className={`avatar avatar-${item.color}`}>{item.initials}</div>
                                <div>
                                  <strong>{item.patient}</strong>
                                  <span>{item.specialty}</span>
                                </div>
                              </div>
                            </td>
                            <td>{item.doctor}</td>
                            <td className="time-cell">{item.time}</td>
                            <td><StatusBadge status={item.status} /></td>
                          </tr>
                        ))}
                        {filteredAppointments.length === 0 && (
                          <tr><td colSpan="4" className="empty-state">No matching appointments found.</td></tr>
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
                    <div className="mini-icon"><ChartNoAxesCombined size={19} /></div>
                  </div>
                  {[
                    ["Confirmed", appointments.filter((item) => item.status === "Confirmed").length, "blue"],
                    ["Checked in", appointments.filter((item) => item.status === "Checked in").length, "green"],
                    ["Pending", appointments.filter((item) => item.status === "Pending").length, "orange"],
                  ].map(([label, count, color]) => (
                    <div className="overview-row" key={label}>
                      <div className={`status-dot ${color}`} />
                      <span>{label}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                  <div className="schedule-note">
                    <Clock size={17} />
                    <div>
                      <strong>Stay organized</strong>
                      <p>Keep track of visits and patient appointments in one place.</p>
                    </div>
                  </div>
                  <button className="secondary-button full-button" onClick={() => navigate("Appointments")}>
                    Manage appointments <ArrowUpRight size={16} />
                  </button>
                </div>
              </section>

              <section className="panel patients-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent patients</h3>
                    <p>Quick access to your latest patient records</p>
                  </div>
                  <button className="text-button" onClick={() => navigate("Patients")}>
                    All patients <ChevronRight size={16} />
                  </button>
                </div>
                <div className="patient-list">
                  {patients.filter((person) =>
                    person.name.toLowerCase().includes(search.toLowerCase())
                  ).map((person) => (
                    <div className="patient-item" key={person.id}>
                      <div className={`avatar avatar-${person.color}`}>{person.initials}</div>
                      <div className="patient-details">
                        <strong>{person.name}</strong>
                        <span>{person.id}</span>
                      </div>
                      <div className="patient-visit">
                        <span>Last visit</span>
                        <strong>{person.visit}</strong>
                      </div>
                      <button
                        className="icon-button patient-action"
                        aria-label={`View ${person.name}`}
                        onClick={() => navigate("Patients")}
                      >
                        <ArrowUpRight size={17} />
                      </button>
                    </div>
                  ))}
                  {patients.filter((person) =>
                    person.name.toLowerCase().includes(search.toLowerCase())
                  ).length === 0 && <p className="empty-state">No matching patients found.</p>}
                </div>
              </section>
            </>
          )}

          {activePage === "Appointments" && (
            <>
              <section className="welcome-row">
                <div>
                  <p className="eyebrow">SCHEDULING</p>
                  <h2>Appointment management</h2>
                  <p className="welcome-description">Review and manage patient visits.</p>
                </div>
                <button className="primary-button" onClick={() => setShowForm(true)}>
                  <Plus size={18} /> New appointment
                </button>
              </section>
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>All appointments</h3>
                    <p>{filteredAppointments.length} appointments in this demo</p>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
                    <tbody>
                      {filteredAppointments.map((item) => (
                        <tr key={item.id}>
                          <td><div className="person-cell"><div className={`avatar avatar-${item.color}`}>{item.initials}</div><div><strong>{item.patient}</strong><span>{item.specialty}</span></div></div></td>
                          <td>{item.doctor}</td>
                          <td>{item.date || "Today"}</td>
                          <td className="time-cell">{item.time}</td>
                          <td><StatusBadge status={item.status} /></td>
                        </tr>
                      ))}
                      {filteredAppointments.length === 0 && <tr><td colSpan="5" className="empty-state">No appointments found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activePage === "Patients" && (
            <section className="panel">
              <div className="panel-heading">
                <div><h3>Patient directory</h3><p>Sample patient records for the demo</p></div>
                <div className="mini-icon"><UserRound size={19} /></div>
              </div>
              <div className="patient-list">
                {patients.filter((person) => person.name.toLowerCase().includes(search.toLowerCase())).map((person) => (
                  <div className="patient-item" key={person.id}>
                    <div className={`avatar avatar-${person.color}`}>{person.initials}</div>
                    <div className="patient-details"><strong>{person.name}</strong><span>{person.id}</span></div>
                    <div className="patient-visit"><span>Last visit</span><strong>{person.visit}</strong></div>
                  </div>
                ))}
                {patients.filter((person) => person.name.toLowerCase().includes(search.toLowerCase())).length === 0 && <p className="empty-state">No matching patients found.</p>}
              </div>
            </section>
          )}

          {activePage === "Doctors" && (
            <section className="directory-grid">
              {[
                ["Dr. James Wilson", "Cardiology", "JW", "blue"],
                ["Dr. Sophia Chen", "Dermatology", "SC", "purple"],
                ["Dr. Michael Brown", "General Medicine", "MB", "green"],
              ].map(([name, specialty, initials, color]) => (
                <div className="panel doctor-card" key={name}>
                  <div className={`doctor-avatar avatar-${color}`}><Stethoscope size={25} /></div>
                  <h3>{name}</h3>
                  <p>{specialty}</p>
                  <div className="doctor-availability"><span className="online-dot" /> Available for appointments</div>
                  <button className="secondary-button full-button" onClick={() => { setShowForm(true); setNotice(""); }}>
                    Book appointment <ArrowUpRight size={16} />
                  </button>
                </div>
              ))}
            </section>
          )}

          {activePage === "Calendar" && (
            <section className="panel">
              <div className="panel-heading">
                <div><h3>Appointment calendar</h3><p>Current appointment schedule</p></div>
              </div>
              <div className="calendar-list">
                {filteredAppointments.map((item) => (
                  <div className="calendar-event" key={item.id}>
                    <div className="calendar-time">{item.time}</div>
                    <div className={`calendar-event-line ${item.color}`} />
                    <div className="calendar-event-content">
                      <strong>{item.patient}</strong>
                      <span>{item.doctor} · {item.specialty}</span>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
                {filteredAppointments.length === 0 && <p className="empty-state">No matching appointments.</p>}
              </div>
            </section>
          )}

          {activePage === "Analytics" && (
            <section className="stats-grid">
              <StatCard icon={CalendarDays} color="blue" label="Appointments listed" value={appointments.length} change="Live" description="in this demo" />
              <StatCard icon={CheckCircle2} color="green" label="Confirmed" value={appointments.filter((item) => item.status === "Confirmed").length} change="Live" description="current status" />
              <StatCard icon={Clock} color="orange" label="Pending" value={appointments.filter((item) => item.status === "Pending").length} change="Live" description="current status" />
              <StatCard icon={Users} color="purple" label="Sample patients" value={patients.length} change="Demo" description="example records" />
              <div className="panel analytics-note">
                <h3>Clinic activity</h3>
                <p>This initial dashboard reports live counts from the demo appointment list. We'll add charts and date-based analytics in a later stage.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      {showForm && (
        <div className="modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowForm(false);
        }}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="appointment-title">
            <div className="modal-heading">
              <div>
                <p className="eyebrow">SCHEDULING</p>
                <h2 id="appointment-title">New appointment</h2>
                <p>Add a patient visit to the schedule.</p>
              </div>
              <button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close form"><X size={20} /></button>
            </div>
            <form onSubmit={addAppointment}>
              <label>Patient name<input name="patient" placeholder="Enter full name" required maxLength="100" /></label>
              <label>Doctor
                <select name="doctor" required defaultValue="">
                  <option value="" disabled>Select a doctor</option>
                  <option>Dr. James Wilson</option>
                  <option>Dr. Sophia Chen</option>
                  <option>Dr. Michael Brown</option>
                </select>
              </label>
              <label>Specialty
                <select name="specialty" required defaultValue="General Medicine">
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Dermatology</option>
                </select>
              </label>
              <div className="form-row">
                <label>Date<input name="date" type="date" required defaultValue={new Date().toLocaleDateString("en-CA")} /></label>
                <label>Time<input name="time" type="time" required defaultValue="09:00" /></label>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="primary-button"><Plus size={17} /> Create appointment</button>
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
        <div className={`stat-icon ${color}`}><Icon size={21} /></div>
        <span className={`stat-change ${change === "Live" || change === "Demo" ? "neutral" : ""}`}>
          {change !== "Live" && change !== "Demo" && <ArrowUpRight size={13} />}
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

function StatusBadge({ status }) {
  const className = status.toLowerCase().replace(/\s+/g, "-");
  return <span className={`status-badge ${className}`}>{status}</span>;
}

export default App;

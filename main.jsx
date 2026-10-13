
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const today = () => new Date().toLocaleDateString("en-CA");

const doctors = [
  { id: "d1", name: "Dr. Ananya Rao", specialty: "General Medicine", room: "101", fee: 500 },
  { id: "d2", name: "Dr. Vikram Reddy", specialty: "Cardiology", room: "203", fee: 800 },
  { id: "d3", name: "Dr. Meera Shah", specialty: "Dermatology", room: "105", fee: 650 },
  { id: "d4", name: "Dr. Rahul Kumar", specialty: "Pediatrics", room: "112", fee: 450 }
];

const initialPatients = [
  { id: "p1", name: "Arjun Kumar", phone: "9876543210", age: 28, gender: "Male" },
  { id: "p2", name: "Sneha Reddy", phone: "9848012345", age: 34, gender: "Female" },
  { id: "p3", name: "Rohit Sharma", phone: "9988776655", age: 41, gender: "Male" }
];

const initialAppointments = [
  { id: "a1", patientId: "p1", doctorId: "d1", date: today(), time: "09:00", reason: "Routine consultation", status: "Confirmed" },
  { id: "a2", patientId: "p2", doctorId: "d2", date: today(), time: "10:30", reason: "Follow-up", status: "Scheduled" },
  { id: "a3", patientId: "p3", doctorId: "d3", date: today(), time: "12:00", reason: "Skin consultation", status: "Scheduled" }
];

function useSavedState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [patients, setPatients] = useSavedState("careflow_patients", initialPatients);
  const [appointments, setAppointments] = useSavedState("careflow_appointments", initialAppointments);
  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patientId: "p1",
    doctorId: "d1",
    date: today(),
    time: "09:00",
    reason: "",
    status: "Scheduled"
  });

  const getPatient = id => patients.find(p => p.id === id);
  const getDoctor = id => doctors.find(d => d.id === id);

  const todayAppointments = appointments.filter(a => a.date === today());
  const completed = appointments.filter(a => a.status === "Completed").length;
  const pending = appointments.filter(a => a.status === "Scheduled" || a.status === "Confirmed").length;

  const filteredAppointments = appointments
    .filter(a => {
      const patient = getPatient(a.patientId);
      const doctor = getDoctor(a.doctorId);
      const text = `${patient?.name || ""} ${doctor?.name || ""} ${a.reason}`.toLowerCase();
      return text.includes(search.toLowerCase());
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  function openForm() {
    setError("");
    setForm({
      patientId: patients[0]?.id || "",
      doctorId: doctors[0]?.id || "",
      date: today(),
      time: "09:00",
      reason: "",
      status: "Scheduled"
    });
    setShowForm(true);
  }

  function saveAppointment(event) {
    event.preventDefault();
    setError("");

    if (!form.patientId || !form.doctorId || !form.date || !form.time || !form.reason.trim()) {
      setError("Please complete all fields.");
      return;
    }

    const conflict = appointments.some(
      a => a.doctorId === form.doctorId &&
           a.date === form.date &&
           a.time === form.time &&
           a.status !== "Cancelled"
    );

    if (conflict) {
      setError("This doctor already has an appointment at that time.");
      return;
    }

    setAppointments(old => [
      ...old,
      { ...form, id: "a" + Date.now() }
    ]);

    setShowForm(false);
  }

  function updateStatus(id, status) {
    setAppointments(old =>
      old.map(a => a.id === id ? { ...a, status } : a)
    );
  }

  function deleteAppointment(id) {
    if (window.confirm("Delete this appointment?")) {
      setAppointments(old => old.filter(a => a.id !== id));
    }
  }

  function addPatient(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const patient = {
      id: "p" + Date.now(),
      name: data.get("name").trim(),
      phone: data.get("phone").trim(),
      age: Number(data.get("age")),
      gender: data.get("gender")
    };

    if (!patient.name || !patient.phone || !patient.age) return;

    setPatients(old => [...old, patient]);
    event.currentTarget.reset();
    alert("Patient added successfully.");
  }

  function removePatient(id) {
    if (!window.confirm("Delete this patient and their appointments?")) return;

    setPatients(old => old.filter(p => p.id !== id));
    setAppointments(old => old.filter(a => a.patientId !== id));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✚</span>
          <div><strong>CareFlow</strong><small>Clinic Planner</small></div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        {["Dashboard", "Appointments", "Patients", "Doctors", "Calendar"].map(item => (
          <button
            key={item}
            className={`nav-item ${page === item ? "active" : ""}`}
            onClick={() => setPage(item)}
          >
            <span>{{
              Dashboard: "▦",
              Appointments: "▣",
              Patients: "♙",
              Doctors: "⚕",
              Calendar: "▤"
            }[item]}</span>
            {item}
          </button>
        ))}

        <div className="sidebar-footer">
          <div className="avatar">AD</div>
          <div><strong>Admin Desk</strong><small>Reception</small></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">OUTPATIENT CLINIC</span>
            <h1>{page}</h1>
          </div>
          <button className="button primary" onClick={openForm}>+ New appointment</button>
        </header>

        {page === "Dashboard" && (
          <>
            <section className="welcome">
              <div>
                <span className="eyebrow">CLINIC OVERVIEW</span>
                <h2>Welcome to CareFlow</h2>
                <p>Manage patient visits and doctor schedules in one place.</p>
              </div>
              <span className="today-label">{today()}</span>
            </section>

            <section className="stats-grid">
              <Stat title="Today's appointments" value={todayAppointments.length} icon="▣" />
              <Stat title="Total patients" value={patients.length} icon="♙" />
              <Stat title="Completed visits" value={completed} icon="✓" />
              <Stat title="Pending visits" value={pending} icon="◷" />
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div><h2>Today's schedule</h2><p>Appointments booked for today</p></div>
                <button className="button secondary" onClick={() => setPage("Appointments")}>View all</button>
              </div>
              <AppointmentTable
                appointments={todayAppointments}
                getPatient={getPatient}
                getDoctor={getDoctor}
                updateStatus={updateStatus}
                deleteAppointment={deleteAppointment}
              />
            </section>
          </>
        )}

        {page === "Appointments" && (
          <section className="panel">
            <div className="panel-heading">
              <div><h2>Appointment planner</h2><p>Search and manage patient appointments.</p></div>
              <button className="button primary" onClick={openForm}>+ Book appointment</button>
            </div>
            <input className="search-input" placeholder="Search patient, doctor or reason..." value={search} onChange={e => setSearch(e.target.value)} />
            <AppointmentTable
              appointments={filteredAppointments}
              getPatient={getPatient}
              getDoctor={getDoctor}
              updateStatus={updateStatus}
              deleteAppointment={deleteAppointment}
            />
          </section>
        )}

        {page === "Patients" && (
          <section className="panel">
            <div className="panel-heading">
              <div><h2>Patient directory</h2><p>Registered outpatient patients</p></div>
            </div>
            <form className="patient-form" onSubmit={addPatient}>
              <input name="name" placeholder="Full name" required />
              <input name="phone" placeholder="Phone number" required />
              <input name="age" type="number" min="1" max="120" placeholder="Age" required />
              <select name="gender"><option>Male</option><option>Female</option><option>Other</option></select>
              <button className="button primary">Add patient</button>
            </form>
            <div className="table-wrap"><table>
              <thead><tr><th>Name</th><th>Phone</th><th>Age</th><th>Gender</th><th>Appointments</th><th>Action</th></tr></thead>
              <tbody>{patients.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td><td>{p.phone}</td><td>{p.age}</td><td>{p.gender}</td>
                  <td>{appointments.filter(a => a.patientId === p.id).length}</td>
                  <td><button className="button danger" onClick={() => removePatient(p.id)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table></div>
          </section>
        )}

        {page === "Doctors" && (
          <section className="doctor-grid">
            {doctors.map(d => (
              <article className="doctor-card" key={d.id}>
                <div className="doctor-symbol">⚕</div>
                <h2>{d.name}</h2><p>{d.specialty}</p>
                <div className="doctor-detail"><span>Consultation room</span><strong>{d.room}</strong></div>
                <div className="doctor-detail"><span>Consultation fee</span><strong>₹{d.fee}</strong></div>
                <div className="doctor-detail"><span>Appointments</span><strong>{appointments.filter(a => a.doctorId === d.id).length}</strong></div>
              </article>
            ))}
          </section>
        )}

        {page === "Calendar" && (
          <section className="panel">
            <div className="panel-heading">
              <div><h2>Appointment calendar</h2><p>Choose a date to view the schedule.</p></div>
              <input aria-label="Calendar date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <AppointmentTable
              appointments={appointments.filter(a => a.date === form.date)}
              getPatient={getPatient}
              getDoctor={getDoctor}
              updateStatus={updateStatus}
              deleteAppointment={deleteAppointment}
            />
          </section>
        )}
      </main>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowForm(false)}>
          <form className="modal" onSubmit={saveAppointment}>
            <div className="panel-heading">
              <div><h2>New appointment</h2><p>Enter the visit details.</p></div>
              <button type="button" className="close-button" onClick={() => setShowForm(false)}>×</button>
            </div>

            {patients.length === 0 && <p className="error">Add a patient before booking an appointment.</p>}

            <label>Patient
              <select value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} required>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>

            <label>Doctor
              <select value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))} required>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
              </select>
            </label>

            <div className="form-row">
              <label>Date<input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required /></label>
              <label>Time<input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required /></label>
            </div>

            <label>Reason for visit
              <input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. Follow-up consultation" required />
            </label>

            <label>Status
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>Scheduled</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option>
              </select>
            </label>

            {error && <p className="error">{error}</p>}

            <div className="modal-actions">
              <button type="button" className="button secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="button primary" disabled={patients.length === 0}>Save appointment</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <article className="stat-card">
      <span className="stat-icon">{icon}</span>
      <div><p>{title}</p><strong>{value}</strong></div>
    </article>
  );
}

function AppointmentTable({ appointments, getPatient, getDoctor, updateStatus, deleteAppointment }) {
  if (appointments.length === 0) {
    return <div className="empty-state"><span>▤</span><h3>No appointments found</h3><p>Try another date or create a new appointment.</p></div>;
  }

  return (
    <div className="table-wrap"><table>
      <thead><tr><th>Date & time</th><th>Patient</th><th>Doctor</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{appointments.map(a => (
        <tr key={a.id}>
          <td><strong>{a.date}</strong><small>{a.time}</small></td>
          <td>{getPatient(a.patientId)?.name || "Deleted patient"}</td>
          <td>{getDoctor(a.doctorId)?.name || "Unknown doctor"}</td>
          <td>{a.reason}</td>
          <td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td>
          <td><div className="action-buttons">
            {a.status !== "Completed" && a.status !== "Cancelled" && <button className="button secondary" onClick={() => updateStatus(a.id, "Completed")}>Complete</button>}
            <button className="button danger" onClick={() => deleteAppointment(a.id)}>Delete</button>
          </div></td>
        </tr>
      ))}</tbody>
    </table></div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

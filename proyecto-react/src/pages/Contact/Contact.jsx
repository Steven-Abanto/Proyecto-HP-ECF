import React, { useState } from "react";
import "../pages.css";

const SUPPORT_EMAIL = "soporte@idatbank.com";
const PHONE_NUMBER_DISPLAY = "(01) 234-5678";
const PHONE_NUMBER_TEL = "+5112345678"; // para <a href="tel:">
const WHATSAPP_DISPLAY = "+51 999 999 999";
const WHATSAPP_LINK = "https://wa.me/51999999999"; // ajusta si tienes número real

export default function Contact() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = `[Contacto web] ${form.asunto || "Consulta"} — ${form.nombre || "Sin nombre"}`;
    const body =
      `Nombre: ${form.nombre || "-"}\n` +
      `Correo: ${form.correo || "-"}\n\n` +
      `Mensaje:\n${form.mensaje || "-"}`;

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Contacto</h1>

      <div className="row g-3">
        {/* Canales de atención */}
        <div className="col-12 col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Canales de atención</h5>
              <p className="mb-2">
                <strong>Correo:</strong>{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              </p>
              <p className="mb-2">
                <strong>Teléfono:</strong>{" "}
                <a href={`tel:${PHONE_NUMBER_TEL}`}>{PHONE_NUMBER_DISPLAY}</a>
              </p>
              <p className="mb-0">
                <strong>WhatsApp:</strong>{" "}
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                  {WHATSAPP_DISPLAY}
                </a>
              </p>
              <hr />
              <h6 className="mb-2">Horarios de atención (GMT-5)</h6>
              <ul className="mb-0">
                <li>Lunes a Viernes: 9:00 – 18:00</li>
                <li>Sábados: 9:00 – 13:00</li>
                <li>Domingos y feriados: solo soporte por correo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dirección / Sede */}
        <div className="col-12 col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Sede de atención</h5>
              <p className="mb-1"><strong>Oficina Central (Lima)</strong></p>
              <p className="mb-3">Av. Ejemplo 123, Miraflores, Lima — Perú</p>
              <div className="ratio ratio-16x9 rounded bg-light">
                {/* Si tienes un mapa real, reemplaza por un iframe de Google Maps */}
                <div className="d-flex align-items-center justify-content-center text-muted">
                  Mapa referencial
                </div>
              </div>
              <small className="text-muted d-block mt-2">
                Para atención presencial, trae tu DNI y constancia de matrícula si tu consulta
                es sobre el préstamo estudiantil.
              </small>
            </div>
          </div>
        </div>

{/*      Formulario rápido (mailto)
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Escríbenos</h5>
              <p className="text-muted">
                Completa el formulario y tu cliente de correo se abrirá con el mensaje listo para enviar.
              </p>
              <form onSubmit={onSubmit} className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    className="form-control"
                    value={form.nombre}
                    onChange={onChange}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="correo" className="form-label">Correo</label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    className="form-control"
                    value={form.correo}
                    onChange={onChange}
                    placeholder="tucorreo@ejemplo.com"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="asunto" className="form-label">Asunto</label>
                  <input
                    id="asunto"
                    name="asunto"
                    type="text"
                    className="form-control"
                    value={form.asunto}
                    onChange={onChange}
                    placeholder="Consulta sobre préstamo estudiantil"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="mensaje" className="form-label">Mensaje</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    className="form-control"
                    rows={5}
                    value={form.mensaje}
                    onChange={onChange}
                    placeholder="Cuéntanos brevemente tu consulta"
                    required
                  />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-primary">Enviar</button>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="btn btn-outline-secondary">
                    Abrir correo vacío
                  </a>
                </div>
              </form>
            </div>

          </div>
        </div>
    */}

        {/* Enlaces útiles */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Enlaces útiles</h5>
              <ul className="mb-0">
                <li><a href="/faq">Preguntas frecuentes</a></li>
                <li><a href="/loans">Solicitar préstamo estudiantil</a></li>
                <li><a href="/about">Sobre Idatbank</a></li>
{/*                 <li><a href="/claims">Libro de Reclamaciones</a></li>
                <li><a href="/privacy">Política de privacidad</a></li> */}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

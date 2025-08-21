import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages.css";

const API_BASE = (import.meta.env?.VITE_API_URL) ?? "http://localhost:5066";

// Lee el uid desde localStorage: primero objeto 'auth', luego 'userId'
function getUidFromStorage() {
  const raw = localStorage.getItem("auth");
  if (raw) {
    try {
      const obj = JSON.parse(raw);
      const uid =
        obj?.uidUsuario ??
        obj?.UidUsuario ??
        obj?.uid ??
        obj?.id ??
        null;
      if (uid !== null && uid !== undefined) return uid;
    } catch {}
  }
  const legacy = localStorage.getItem("userId");
  return legacy ?? null;
}

export default function Transfers() {
  const [accounts, setAccounts] = useState([]);
  const [ctaOrigen, setCtaOrigen] = useState("");
  const [ctaDestin, setCtaDestin] = useState("");
  const [monto, setMonto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const navigate = useNavigate();
  const uid = useMemo(() => getUidFromStorage(), []);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!uid) {
        setError("No se encontró un usuario autenticado.");
        return;
      }
      setLoading(true);
      setError("");
      setOkMsg("");
      try {
        const res = await fetch(`${API_BASE}/api/Cuenta/by-user/${uid}`);
        if (!res.ok) throw new Error("Error al cargar las cuentas");
        const data = await res.json();
        setAccounts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "No se pudieron cargar las cuentas.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [uid]);

  const fmtMoney = (n) =>
    Number(n ?? 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOkMsg("");

    if (!ctaOrigen || !ctaDestin || !monto) {
      setError("Completa todos los campos.");
      return;
    }

    if (ctaOrigen === ctaDestin) {
      setError("La cuenta destino no puede ser igual a la cuenta origen.");
      return;
    }

    if (!/^\d{18}$/.test(ctaDestin)) {
      setError("La cuenta destino debe tener 18 dígitos.");
      return;
    }

    const montoNum = Number(monto);
    if (!Number.isFinite(montoNum) || montoNum <= 0) {
      setError("Ingresa un monto válido mayor a 0.");
      return;
    }

    const origen = accounts.find(
      (a) => (a.nroCuenta ?? a.NroCuenta) === ctaOrigen
    );
    const saldoOrigen = Number(origen?.saldo ?? origen?.Saldo ?? 0);
    if (origen && montoNum > saldoOrigen) {
      setError("Saldo insuficiente en la cuenta de origen.");
      return;
    }

    //Enviar información de la transferencia al backend
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/Movimiento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuentaOrigen: ctaOrigen,
          cuentaDestino: ctaDestin,
          monto: Number(montoNum).toFixed(2), // Aseguramos que sea un número con 2 decimales
        }),
      });
      if (!res.ok) {
        let msg = "No se pudo procesar la transferencia.";
        try {
          const err = await res.json();
          msg = err.message ?? msg;
        } catch {}
        throw new Error(msg);
      }

      setCtaDestin("");
      setMonto("");
      navigate("/accounts");
      alert("Transferencia realizada con éxito.");
    } catch (e) {
      setError(e.message || "No se pudo procesar la transferencia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Realiza transferencias</h2>

      {!uid && (
        <div className="alert alert-warning mb-3">
          No hay sesión activa. Inicia sesión para ver tus cuentas.
        </div>
      )}
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {okMsg && <div className="alert alert-success mb-3">{okMsg}</div>}

      <div className="mb-3">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="ctaOrigen" className="form-label">Cuenta Origen</label>
            <select
              id="ctaOrigen"
              name="ctaOrigen"
              className="form-select"
              value={ctaOrigen}
              onChange={(e) => setCtaOrigen(e.target.value)}
              disabled={loading || !uid || accounts.length === 0}
            >
              <option value="" disabled>
                {loading ? "Cargando cuentas..." : "Seleccione una cuenta"}
              </option>
              {accounts.map((a) => {
                const key = a.uidCuenta ?? a.UidCuenta;
                const nro = a.nroCuenta ?? a.NroCuenta;
                const saldo = a.saldo ?? a.Saldo;
                const tipo = a.tipoCuenta ?? a.TipoCuenta;
                return (
                  <option key={key} value={nro}>
                    {nro} — {tipo} — {fmtMoney(saldo)}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="ctaDestin" className="form-label">Cuenta Destino</label>
            <input
              type="text"
              id="ctaDestin"
              name="ctaDestin"
              className="form-control"
              inputMode="numeric"
              pattern="\d{18}"
              title="Ingrese 18 dígitos"
              placeholder="Ej. 001104020123456789"
              value={ctaDestin}
              onChange={(e) => setCtaDestin(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="monto" className="form-label">Monto (S/.)</label>
            <input
              type="number"
              id="monto"
              name="monto"
              className="form-control"
              inputMode="decimal"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              disabled={loading}
            />
            <p className="form-text">
              *Si la cuenta destino tiene otra moneda, se aplicará el tipo de cambio del banco destino.
            </p>
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary mx-1"
              disabled={!ctaOrigen || !ctaDestin || !monto || loading}
            >
              {loading ? "Procesando..." : "Transferir"}
            </button>
            <button
              type="button"
              className="btn btn-secondary mx-1"
              onClick={() => navigate("/accounts")}
              >
              Volver a Cuentas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

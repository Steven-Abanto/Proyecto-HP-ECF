import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages.css";

const API_BASE = (import.meta.env?.VITE_API_URL) ?? "http://localhost:5066";

//Lee el uid del usuario logueado desde localStorage: primero objeto 'auth', luego 'userId'
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

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowBusy, setRowBusy] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const uid = useMemo(() => getUidFromStorage(), []);

  const fetchAccounts = async (uidToUse = uid) => {
    if (!uidToUse) {
      setError("No se encontró un usuario autenticado.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/Cuenta/by-user/${uidToUse}`);
      if (!response.ok) throw new Error("Error al cargar las cuentas");
      const data = await response.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "No se pudieron cargar las cuentas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(uid);
  }, [uid]);

  const goTransfers = () => { navigate("/transfers"); };
  const goLoansHistory = () => { navigate("/loanshist"); };

  const fmtMoney = (n) =>
    Number(n ?? 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" });


  //Activa o desactiva las compras por internet de una cuenta
  const toggleCompraInt = async (acc) => {
    if (!acc) return;
    const id = acc.uidCuenta;
    setRowBusy(b => ({ ...b, [id]: true }));
    setError("");
    try {
      const payload = {
        uidCuenta: acc.uidCuenta,
        nroCuenta: acc.nroCuenta,
        tipoCuenta: acc.tipoCuenta,
        saldo: acc.saldo,
        compraInt: !acc.compraInt,
        uidUsuario: acc.uidUsuario,
      };

      const res = await fetch(`${API_BASE}/api/Cuenta/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "No se pudo actualizar la cuenta.";
        try { const j = await res.json(); msg = j.message ?? msg; } catch {}
        throw new Error(msg);
      }

      setAccounts(prev =>
        prev.map(a => a.uidCuenta === id ? { ...a, compraInt: !acc.compraInt } : a)
      );
    } catch (e) {
      setError(e.message || "Error al actualizar la cuenta.");
    } finally {
      setRowBusy(b => {
        const copy = { ...b };
        delete copy[id];
        return copy;
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2">
        <h3 className="m-0">Cuentas</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => fetchAccounts()} disabled={loading || !uid}>
            {loading ? "Cargando..." : "Actualizar"}
          </button>
          <button className="btn btn-secondary" onClick={goLoansHistory}>
            Ver préstamos
          </button>
          <button className="btn btn-success" onClick={goTransfers}>
            Transferir dinero
          </button>
        </div>
      </div>

      {!uid && (
        <div className="alert alert-warning">No hay sesión activa. Inicia sesión para ver tus cuentas.</div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {accounts.length === 0 && !loading && uid && !error && (
        <div className="alert alert-info">No se encontraron cuentas.</div>
      )}

      <ul className="list-group">
        {accounts.map((account) => {
          const key = account.uidCuenta;
          const nro = account.nroCuenta;
          const tipo = account.tipoCuenta;
          const saldo = account.saldo;
          const compraInt = !!account.compraInt;
          const busy = !!rowBusy[key];

          return (
            <li key={key} className="list-group-item d-flex justify-content-between align-items-center gap-3">
              <div className="d-flex flex-column">
                <div className="fw-semibold">{nro}</div>
                <small className="text-muted">{tipo}</small>
              </div>

              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-secondary rounded-pill">{fmtMoney(saldo)}</span>

                <button
                  type="button"
                  className={`btn ${compraInt ? "btn-outline-success" : "btn-outline-danger"}`}
                  disabled={busy || loading}
                  onClick={() => toggleCompraInt(account)}
                  title="Activar/Desactivar compras por internet"
                >
                  {busy
                    ? "Actualizando…"
                    : compraInt
                      ? "Compras online: ON"
                      : "Compras online: OFF"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const API_BASE = (import.meta.env?.VITE_API_URL) ?? "http://localhost:5066";

// Lee el uid desde localStorage: primero objeto 'auth', luego 'userId'
function getAuth() {
  const raw = localStorage.getItem("auth");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function getUidFromStorage() {
  const a = getAuth();
  if (a && (a.uidUsuario ?? a.UidUsuario ?? a.uid ?? a.id) != null) {
    return a.uidUsuario ?? a.UidUsuario ?? a.uid ?? a.id;
  }
  const legacy = localStorage.getItem("userId");
  return legacy ?? null;
}

//Calcula la cuota y el total del préstamo
function calcularCuotaYTotal(monto, interesAnualPct, cuotas) {
  const P = Number(monto);
  const i = Number(interesAnualPct) / 100 / 12;
  const n = Number(cuotas);
  if (P <= 0 || n <= 0 || i < 0) return { cuota: 0, total: 0 };
  if (i === 0) {
    const cuota = P / n;
    return { cuota, total: cuota * n };
  }
  const cuota = P * (i / (1 - Math.pow(1 + i, -n)));
  const total = cuota * n;
  return { cuota, total };
}

export default function Loans() {
  const navigate = useNavigate();

  const auth = useMemo(() => getAuth(), []);
  const uid = useMemo(() => getUidFromStorage(), []);

  const [accounts, setAccounts] = useState([]);
  const [ctaDestino, setCtaDestino] = useState("");

  const [formData, setFormData] = useState({
    nombre: auth?.nombres ?? auth?.Nombres ?? "",
    dni: auth?.nroDocumento ?? auth?.NroDocumento ?? "",
    prestamo: "",
    interes: "",
    cuotas: ""
  });

  const [loadingAcc, setLoadingAcc] = useState(false);
  const [loadingReq, setLoadingReq] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  //Carga las cuentas del usuario
  useEffect(() => {
    const loadAccounts = async () => {
      if (!uid) { setError("No hay sesión activa."); return; }
      setLoadingAcc(true);
      setError(""); setOkMsg("");
      try {
        const res = await fetch(`${API_BASE}/api/Cuenta/by-user/${uid}`);
        if (!res.ok) throw new Error("No se pudieron cargar las cuentas.");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setAccounts(list);
        const first = list[0]?.nroCuenta ?? list[0]?.NroCuenta ?? "";
        setCtaDestino((prev) => prev || first || "");
      } catch (e) {
        setError(e.message || "Error al cargar cuentas.");
      } finally {
        setLoadingAcc(false);
      }
    };
    loadAccounts();
  }, [uid]);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  //Envía la solicitud de préstamo
  const handleSolicitar = async (e) => {
    e.preventDefault();
    setError(""); setOkMsg("");

    const montoNum = Number(formData.prestamo);
    const interesNum = Number(formData.interes);
    const cuotasNum = Number(formData.cuotas);

    if (!ctaDestino) return setError("Selecciona una cuenta destino.");
    if (!Number.isFinite(montoNum) || montoNum <= 0) return setError("Ingresa un monto válido (> 0).");
    if (!Number.isFinite(interesNum) || interesNum < 0) return setError("Ingresa un interés válido (≥ 0).");
    if (!Number.isInteger(cuotasNum) || cuotasNum <= 0) return setError("Ingresa un número de cuotas válido (≥ 1).");

    const { cuota, total } = calcularCuotaYTotal(montoNum, interesNum, cuotasNum);

    setLoadingReq(true);
    try {
      const prestamoRes = await fetch(`${API_BASE}/api/Prestamo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoPrestamo: "Consumo",
          montoPrestamo: montoNum,
          fecha: new Date().toISOString()
        })
      });
      if (!prestamoRes.ok) {
        let msg = "No se pudo registrar el préstamo.";
        try { const j = await prestamoRes.json(); msg = j.message ?? msg; } catch {}
        throw new Error(msg);
      }
      const prestamo = await prestamoRes.json();
      const uidPrestamo =
        prestamo.uidPrestamo ?? prestamo.UidPrestamo ?? prestamo.id ?? prestamo.uid;

      if (!uidPrestamo) throw new Error("El backend no devolvió el id del préstamo.");

      const detalleRes = await fetch(`${API_BASE}/api/PrestamoDetalle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uidPrestamo: uidPrestamo,
          nroCuenta: ctaDestino,
          montoPrestamo: montoNum,
          tasaInt: interesNum,
          cuotas: cuotasNum,
          deudaCuota: Number(cuota.toFixed(2)),
          deudaTotal: Number(total.toFixed(2)),
          fecha: new Date().toISOString()
        })
      });
      if (!detalleRes.ok) {
        let msg = "No se pudo registrar el detalle del préstamo.";
        try { const j = await detalleRes.json(); msg = j.message ?? msg; } catch {}
        throw new Error(msg);
      }

      setOkMsg("Solicitud de préstamo registrada con éxito.");
      navigate("/accounts");
    } catch (err) {
      setError(err.message || "No se pudo procesar la solicitud.");
    } finally {
      setLoadingReq(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Solicitud de Préstamo</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {okMsg && <div className="alert alert-success">{okMsg}</div>}

      <form onSubmit={handleSolicitar}>
        <div className="mb-3 container">
          <div className="row row-cols-2">
            <div className="col-6">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text" id="nombre" name="nombre" className="form-control"
                value={formData.nombre} onChange={handleChange} required
                disabled
              />
            </div>
            <div className="col-6">
              <label htmlFor="dni" className="form-label">DNI</label>
              <input
                type="text" id="dni" name="dni" className="form-control"
                value={formData.dni} onChange={handleChange} required
                disabled
              />
            </div>

            <div className="col-6">
              <label htmlFor="ctaDestino" className="form-label">Cuenta destino</label>
              <select
                id="ctaDestino" name="ctaDestino" className="form-select"
                value={ctaDestino} onChange={(e) => setCtaDestino(e.target.value)}
                disabled={loadingAcc || accounts.length === 0}
                required
              >
                {accounts.length === 0 ? (
                  <option value="">No hay cuentas disponibles</option>
                ) : (
                  accounts.map((a) => {
                    const key = a.uidCuenta ?? a.UidCuenta;
                    const nro = a.nroCuenta ?? a.NroCuenta;
                    const tipo = a.tipoCuenta ?? a.TipoCuenta;
                    const saldo = a.saldo ?? a.Saldo;
                    return (
                      <option key={key} value={nro}>
                        {nro} — {tipo} — S/ {Number(saldo ?? 0).toFixed(2)}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
            <div className="col-6">
              <label htmlFor="prestamo" className="form-label">Monto del Préstamo (S/)</label>
              <input
                type="number" id="prestamo" name="prestamo" min={0.01} step={0.01}
                className="form-control" value={formData.prestamo}
                onChange={handleChange} required
              />
            </div>

            <div className="col-6">
              <label htmlFor="interes" className="form-label">Interés anual (%)</label>
              <input
                type="number" id="interes" name="interes" min={0} step={0.01}
                className="form-control" value={formData.interes}
                onChange={handleChange} required
              />
            </div>
            <div className="col-6">
              <label htmlFor="cuotas" className="form-label">Número de Cuotas</label>
              <input
                type="number" id="cuotas" name="cuotas" min={1} step={1}
                className="form-control" value={formData.cuotas}
                onChange={handleChange} required
              />
            </div>
          </div>

          <p className="text-muted mt-3">
            *Los intereses se calculan usando una cuota fija mensual. Puedes ajustar la tasa según política del banco.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/accounts")}
          >
            Volver a Cuentas
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loadingAcc || loadingReq}
          >
            {loadingReq ? "Enviando…" : "Solicitar"}
          </button>
        </div>
      </form>
    </div>
  );
}

import React from 'react';

//Página de Preguntas Frecuentes, solo es informativa
function FAQ() {
  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Preguntas Frecuentes — Préstamo Estudiantil</h2>

      <div className="accordion" id="faqAccordion">
        {/* Sobre el producto */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="heading1">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
              ¿Qué es el préstamo estudiantil de Idatbank?
            </button>
          </h2>
          <div id="collapse1" className="accordion-collapse collapse show">
            <div className="accordion-body">
              Es un financiamiento diseñado para alumnos y sus familias que cubre matrícula, pensiones,
              titulación, materiales, movilidad y equipos (p. ej., laptop). Ofrece trámites simples, cuotas
              fijas y opciones de periodo de gracia mientras estudias.
            </div>
          </div>
        </div>

        {/* Monto y plazo */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="heading2">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
              ¿Cuál es el monto y plazo que puedo solicitar?
            </button>
          </h2>
          <div id="collapse2" className="accordion-collapse collapse">
            <div className="accordion-body">
              Desde S/ 500 hasta S/ 20,000 (según evaluación). El plazo típico va de 6 a 48 meses.
              Puedes elegir pagar durante el ciclo o usar un periodo de gracia y empezar a pagar al finalizar el periodo académico.
            </div>
          </div>
        </div>

        {/* Requisitos */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="heading3">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
              ¿Qué requisitos debo cumplir?
            </button>
          </h2>
        <div id="collapse3" className="accordion-collapse collapse">
            <div className="accordion-body">
              DNI vigente, constancia de matrícula o pre-matrícula, y (si aplica) boleta de pago o declaración de ingresos del estudiante o apoderado.
              En algunos casos se solicitará aval. Todo está sujeto a evaluación crediticia.
            </div>
          </div>
        </div>

        {/* Tasas y costos */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="heading4">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4">
              ¿Qué tasa de interés aplican y hay costos adicionales?
            </button>
          </h2>
          <div id="collapse4" className="accordion-collapse collapse">
            <div className="accordion-body">
              Ofrecemos tasas preferenciales para estudiantes (TEA referencial, sujeta a evaluación).
              La TCEA y el cronograma detallan intereses y cualquier cargo aplicable. No cobramos penalidad por prepago o adelanto de cuotas.
            </div>
          </div>
        </div>

        {/* Desembolso y pagos */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="heading5">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5">
              ¿Cómo se desembolsa y cómo pago mis cuotas?
            </button>
          </h2>
          <div id="collapse5" className="accordion-collapse collapse">
            <div className="accordion-body">
              El desembolso se acredita a tu cuenta en Idatbank o directamente a la institución educativa (según convenio).
              Puedes pagar por transferencia, app bancaria, agentes o débito automático. Ofrecemos recordatorios y simuladores de pago.
            </div>
          </div>
        </div>

        {/* Consultas y soporte */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="heading6">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6">
              ¿Cómo puedo obtener ayuda o más información?
            </button>
          </h2>
          <div id="collapse6" className="accordion-collapse collapse">
            <div className="accordion-body">
              Escríbenos a <a href="mailto:soporte@idatbank.com">soporte@idatbank.com</a> o llámanos al (01) 234-5678.
              Si tu instituto o universidad tiene convenio, consulta por beneficios adicionales y periodos de gracia extendidos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;

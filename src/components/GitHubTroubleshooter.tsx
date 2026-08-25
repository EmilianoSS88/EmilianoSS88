import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, HelpCircle, ShieldAlert, Zap, Terminal, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { PROFILE_INFO } from '../data/profileData';

export const GitHubTroubleshooter: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const steps = [
    {
      id: 'step-public',
      num: '1',
      title: 'Asegúrate de que el repositorio sea PÚBLICO',
      critical: true,
      description: 'GitHub solo muestra el README especial en tu perfil si el repositorio tiene exactamente tu mismo nombre (EmilianoSS88) y está configurado como PÚBLICO. Si está en Privado, no se mostrará nada.',
      actionText: 'Revisar Visibilidad en Settings',
      actionUrl: `https://github.com/${PROFILE_INFO.username}/${PROFILE_INFO.username}/settings#danger-zone`,
      howToFix: 'Ve a Settings > Baja hasta la sección "Danger Zone" > Haz clic en "Change repository visibility" y cámbialo a "Public".',
    },
    {
      id: 'step-actions-perm',
      num: '2',
      title: 'Habilita permisos de Escritura en GitHub Actions',
      critical: true,
      description: 'Para que el workflow de Space Invaders genere el GIF y lo guarde en la rama "output", GitHub Actions necesita permiso de escritura.',
      actionText: 'Abrir Permisos de Actions',
      actionUrl: `https://github.com/${PROFILE_INFO.username}/${PROFILE_INFO.username}/settings/actions`,
      howToFix: 'Ve a Settings > Actions > General > Baja a "Workflow permissions" > Selecciona "Read and write permissions" y pulsa "Save".',
    },
    {
      id: 'step-run-workflow',
      num: '3',
      title: 'Ejecuta el Workflow de Space Invaders por primera vez',
      critical: true,
      description: 'El script genera la animación arcade de Space Invaders basada en tus commits. Ejecútalo manualmente para crear el archivo space-shooter.gif en la rama "output".',
      actionText: 'Ir a la pestaña Actions para ejecutar',
      actionUrl: `https://github.com/${PROFILE_INFO.username}/${PROFILE_INFO.username}/actions`,
      howToFix: 'En la pestaña Actions > Selecciona "Generate Space Invaders Activity Animation" > Haz clic en "Run workflow" > Espera a que se complete en verde ✅.',
    },
    {
      id: 'step-secret',
      num: '4',
      title: 'Archivo de Workflow .github/workflows/space-invaders.yml',
      critical: false,
      description: 'Hemos creado el archivo space-invaders.yml listo para usar con czl9707/gh-space-shooter@master y secrets.GITHUB_TOKEN para evitar cualquier error de credenciales.',
      actionText: 'Ver código en el Inspector',
      actionUrl: `#workflow-section`,
      howToFix: 'Revisa la sección "GitHub Actions Workflow" abajo para copiar el archivo YAML y pegarlo en tu carpeta .github/workflows/.',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900/80 to-zinc-900/60 border-2 border-emerald-500/40 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden shadow-xl shadow-emerald-500/5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 text-lg">
            👾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Guía de Activación de Space Invaders en tu Perfil de GitHub
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Paso a Paso
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              Sigue estos 3 pasos rápidos en tu repositorio <code className="text-emerald-300 font-mono font-bold">EmilianoSS88/EmilianoSS88</code> en GitHub:
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 transition flex items-center gap-1.5"
        >
          <span>{isOpen ? 'Ocultar Guía' : 'Ver Guía Completa'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  step.critical
                    ? 'bg-zinc-950/80 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                } transition`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-400">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[11px] text-emerald-300">
                        {step.num}
                      </span>
                      {step.title}
                    </span>
                    {step.critical && (
                      <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                        Obligatorio
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    {step.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 mb-3">
                    <span className="font-semibold text-emerald-300">Cómo hacerlo:</span> {step.howToFix}
                  </div>
                </div>

                <a
                  href={step.actionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition"
                >
                  <span>{step.actionText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {/* Quick verification summary bar */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Una vez ejecutada la Action, visita{' '}
                <a
                  href={`https://github.com/${PROFILE_INFO.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 font-bold underline inline-flex items-center gap-0.5 ml-1"
                >
                  github.com/{PROFILE_INFO.username} <ExternalLink className="w-3 h-3" />
                </a>{' '}
                y verás tu perfil con la animación Space Invaders de disparos y tus estadísticas.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

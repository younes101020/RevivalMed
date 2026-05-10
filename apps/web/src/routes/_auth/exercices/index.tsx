import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/exercices/')({
  component: Exercices,
})

function Exercices() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exercices</h1>
      <p>Liste des exercices disponibles :</p>
      <ul className="list-disc list-inside mt-2">
        <li>Attention</li>
        <li>Flexibilité</li>
        <li>Information Processing</li>
        <li>Langage</li>
        <li>Memory</li>
        <li>Memory Work</li>
        <li>Planification</li>
        <li>Visuo-spatial</li>
        <li>Vitesse de traitement</li>
      </ul>
    </div>
  );
}
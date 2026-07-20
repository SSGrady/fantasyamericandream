import { V1_STARTER_SCENARIOS } from '@fad/shared';
import { ScenarioCard } from './ScenarioCard';

export function ScenarioCardList() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {V1_STARTER_SCENARIOS.map((scenario) => (
        <li key={scenario.id}>
          <ScenarioCard scenario={scenario} />
        </li>
      ))}
    </ul>
  );
}

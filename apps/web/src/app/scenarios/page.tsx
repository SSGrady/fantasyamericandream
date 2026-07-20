import { PageShell } from '../../components/ui/PageShell';
import { ScenarioCardList } from '../../components/scenarios/ScenarioCardList';

export default function ScenariosPage() {
  return (
    <PageShell
      title="Choose your scenario"
      subtitle="Pick a starting life path. Each scenario sets defaults you can adjust next."
      backHref="/"
      backLabel="Home"
    >
      <ScenarioCardList />
    </PageShell>
  );
}

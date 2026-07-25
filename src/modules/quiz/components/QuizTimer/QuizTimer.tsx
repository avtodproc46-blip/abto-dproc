import './quiz-timer.css';

type Props = {
  secondsLeft: number;
};

function formatTime(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export function QuizTimer({ secondsLeft }: Props) {
  const danger = secondsLeft <= 60;
  return (
    <div className={`quiz-timer ${danger ? 'is-danger' : ''}`}>
      {formatTime(secondsLeft)}
    </div>
  );
}

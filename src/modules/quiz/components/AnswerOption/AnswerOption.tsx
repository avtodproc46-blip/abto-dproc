import { assetUrl } from '../../../../shared/api/api-client';
import type { AnswerModel } from '../../types/quiz-model.type';
import './answer-option.css';

type Props = {
  answer: AnswerModel;
  selected: boolean;
  revealed: boolean;
  onSelect: () => void;
};

export function AnswerOption({ answer, selected, revealed, onSelect }: Props) {
  const image = assetUrl(answer.image);
  let state = '';
  if (revealed) {
    if (answer.isTrue) state = 'is-correct';
    else if (selected) state = 'is-wrong';
  } else if (selected) {
    state = 'is-selected';
  }

  return (
    <button
      type="button"
      className={`answer-option ${state}`}
      onClick={onSelect}
      disabled={revealed}
    >
      {image && <img src={image} alt="" />}
      <span>{answer.title}</span>
    </button>
  );
}

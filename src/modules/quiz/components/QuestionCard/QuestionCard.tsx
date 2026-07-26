import { assetUrl } from '../../../../shared/api/api-client';
import type { QuestionModel } from '../../types/quiz-model.type';
import { AnswerOption } from '../AnswerOption/AnswerOption';
import './question-card.css';

type Props = {
  index: number;
  total: number;
  question: QuestionModel;
  selectedAnswerId: number | null;
  revealed: boolean;
  onSelect: (answerId: number) => void;
};

export function QuestionCard({
  index,
  total,
  question,
  selectedAnswerId,
  revealed,
  onSelect,
}: Props) {
  const isNumberedImageQuestion = question.answers.every((answer) =>
    /^\d+$/.test(answer.title.trim()),
  );
  const answersWithImages = question.answers.filter((answer) => answer.image);
  const compositeAnswerImage =
    !question.image &&
    isNumberedImageQuestion &&
    answersWithImages.length === 1
      ? answersWithImages[0].image
      : null;
  const image = assetUrl(question.image ?? compositeAnswerImage);

  return (
    <article className="panel question-card">
      <div className="question-card__meta">
        Հարց {index + 1} / {total}
      </div>
      <h2>{question.title}</h2>
      {image && (
        <img
          className="question-card__image"
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="question-card__answers">
        {question.answers.map((answer) => (
          <AnswerOption
            key={answer.id}
            answer={
              compositeAnswerImage ? { ...answer, image: null } : answer
            }
            selected={selectedAnswerId === answer.id}
            revealed={revealed}
            onSelect={() => onSelect(answer.id)}
          />
        ))}
      </div>
    </article>
  );
}

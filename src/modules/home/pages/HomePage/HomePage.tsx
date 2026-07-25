import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button/Button';
import type { UserModel } from '../../../users/types/user-model.type';
import { clearStoredUser } from '../../../users/api/user-storage';
import './home-page.css';

type Props = {
  user: UserModel;
  onLogout: () => void;
};

export function HomePage({ user, onLogout }: Props) {
  return (
    <section className="home-page">
      <div className="panel home-page__hero">
        <p className="home-page__eyebrow">Avto Dproc</p>
        <h1>Վարորդական թեստեր</h1>
        <p className="muted">
          Բարև, <strong>{user.name}</strong>. Ընտրիր ռեժիմը՝ սովորական բիլետ կամ
          պատահական քննություն։ Ժամանակը՝ 20 րոպե, անցում՝ 18/20։
        </p>
        <div className="home-page__actions row">
          <Link to="/tests">
            <Button>Թեստեր (բիլետներ)</Button>
          </Link>
          <Link to="/quiz/random">
            <Button variant="warm">Պատահական 20</Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              clearStoredUser();
              onLogout();
            }}
          >
            Փոխել օգտատեր
          </Button>
        </div>
      </div>

      <div className="home-page__cards">
        <article className="panel">
          <h3>1. Բիլետ</h3>
          <p className="muted">
            Ընտրում ես թեստ → մեկնարկից սկսվում է 20 րոպեանոց թայմեր։ Կանաչ
            եզր՝ անցած, կարմիր՝ ձախողված, մոխրագույն՝ չանցած։
          </p>
        </article>
        <article className="panel">
          <h3>2. Պատահական</h3>
          <p className="muted">
            19 պատահական հարց տարբեր թեստերից + վերջինը միշտ բժշկական՝
            պատահական թեստի վերջին հարցը։
          </p>
        </article>
      </div>
    </section>
  );
}

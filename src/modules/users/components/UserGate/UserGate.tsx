import { useState, type FormEvent } from 'react';
import { Button } from '../../../../shared/ui/Button/Button';
import { loginUser, registerUser } from '../../api/users.api';
import { saveStoredUser } from '../../api/user-storage';
import type { UserModel } from '../../types/user-model.type';
import './user-gate.css';

type Props = {
  onReady: (user: UserModel) => void;
};

type Mode = 'login' | 'register';

export function UserGate({ onReady }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!login.trim() || !password) return;

    setLoading(true);
    setError('');
    try {
      const user =
        mode === 'login'
          ? await loginUser(login.trim(), password)
          : await registerUser(login.trim(), password);
      saveStoredUser(user);
      onReady(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Նույնականացման սխալ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel user-gate">
      <h1>{mode === 'login' ? 'Մուտք' : 'Գրանցում'}</h1>
      <p className="muted">
        Մուտքանունը պետք է եզակի լինի։ Գաղտնաբառը՝ առնվազն 6 նիշ։
      </p>

      <div className="user-gate__tabs">
        <button
          type="button"
          className={mode === 'login' ? 'is-active' : ''}
          onClick={() => {
            setMode('login');
            setError('');
          }}
        >
          Մուտք
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'is-active' : ''}
          onClick={() => {
            setMode('register');
            setError('');
          }}
        >
          Գրանցում
        </button>
      </div>

      {error && <p className="user-gate__error">{error}</p>}

      <form className="user-gate__form" onSubmit={handleSubmit}>
        <input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Մուտքանուն"
          autoComplete="username"
          minLength={3}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Գաղտնաբառ"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          minLength={6}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading
            ? '...'
            : mode === 'login'
              ? 'Մուտք'
              : 'Ստեղծել հաշիվ'}
        </Button>
      </form>
    </section>
  );
}
